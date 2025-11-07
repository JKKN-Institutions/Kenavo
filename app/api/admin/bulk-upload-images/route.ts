import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import {
  extractProfileIdFromFilename,
  extractNameFromFilename,
  matchNameToProfile,
  validateImageFile,
  createImageDataUrl,
  hasValidProfileId,
  formatFileSize,
  getFileExtension,
} from '@/lib/bulk-image-handler';

export const dynamic = 'force-dynamic';

// Interface for image mapping result
interface ImageMapping {
  profileId: number;
  profileName: string;
  currentImageUrl: string | null;
  newImagePreview: string;
  fileName: string;
  fileSize: number;
  status: 'ready' | 'error';
  error?: string;
}

// Interface for error
interface ImageError {
  fileName: string;
  error: string;
}

// Response interface
interface BulkUploadResponse {
  mappings: ImageMapping[];
  errors: ImageError[];
  stats: {
    total: number;
    matched: number;
    errors: number;
  };
}

export async function POST(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    // Get form data with ZIP file
    const formData = await request.formData();
    const zipFile = formData.get('zipFile') as File;

    if (!zipFile) {
      return NextResponse.json(
        { error: 'No ZIP file provided' },
        { status: 400 }
      );
    }

    // Validate ZIP file type
    if (!zipFile.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'File must be a ZIP archive' },
        { status: 400 }
      );
    }

    // Load ZIP file
    const zipBuffer = await zipFile.arrayBuffer();
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer);

    const mappings: ImageMapping[] = [];
    const errors: ImageError[] = [];
    const profileIds: number[] = [];
    const nameBasedFiles: Array<{
      filename: string;
      extractedName: string;
      blob: Blob;
      previewUrl: string;
      fileSize: number;
    }> = [];

    // Extract images from ZIP
    const imageFiles = Object.keys(zipContent.files)
      .filter(filename => {
        const file = zipContent.files[filename];
        // Skip directories and hidden files
        if (file.dir || filename.startsWith('__MACOSX') || filename.startsWith('.')) {
          return false;
        }
        // Only include image files
        const lowerName = filename.toLowerCase();
        return lowerName.endsWith('.jpg') ||
               lowerName.endsWith('.jpeg') ||
               lowerName.endsWith('.png') ||
               lowerName.endsWith('.webp');
      });

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No image files found in ZIP archive' },
        { status: 400 }
      );
    }

    // Process each image file
    for (const filename of imageFiles) {
      try {
        const file = zipContent.files[filename];
        const fileBlob = await file.async('blob');

        // Get filename without path (in case ZIP has folders)
        const baseFilename = filename.split('/').pop() || filename;

        // Validate image file
        const validation = validateImageFile(fileBlob, baseFilename);
        if (!validation.isValid) {
          errors.push({
            fileName: baseFilename,
            error: validation.error || 'Invalid image file'
          });
          continue;
        }

        // Create preview data URL
        const mimeType = fileBlob.type || 'image/jpeg';
        const previewUrl = await createImageDataUrl(fileBlob, mimeType);

        // Try extracting profile ID first (numeric format)
        const profileId = extractProfileIdFromFilename(baseFilename);

        if (profileId) {
          // ID-based matching
          if (!profileIds.includes(profileId)) {
            profileIds.push(profileId);
          }

          mappings.push({
            profileId,
            profileName: '', // Will be filled after DB query
            currentImageUrl: null, // Will be filled after DB query
            newImagePreview: previewUrl,
            fileName: baseFilename,
            fileSize: fileBlob.size,
            status: 'ready',
          });
        } else {
          // Try name-based matching
          const extractedName = extractNameFromFilename(baseFilename);

          if (extractedName) {
            // Store for name-based matching
            nameBasedFiles.push({
              filename: baseFilename,
              extractedName,
              blob: fileBlob,
              previewUrl,
              fileSize: fileBlob.size,
            });
          } else {
            errors.push({
              fileName: baseFilename,
              error: 'Could not extract profile ID or name. Use format: {id}.jpg or Img-{Name}.jpg'
            });
          }
        }

      } catch (error) {
        const baseFilename = filename.split('/').pop() || filename;
        errors.push({
          fileName: baseFilename,
          error: error instanceof Error ? error.message : 'Failed to process file'
        });
      }
    }

    // Query database for profiles
    let allProfiles: Array<{ id: number; name: string; profile_image_url: string | null }> = [];

    // Need to fetch all profiles if we have name-based files
    if (nameBasedFiles.length > 0) {
      const { data: allProfilesData, error: allProfilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, profile_image_url');

      if (allProfilesError) {
        console.error('Database error fetching all profiles:', allProfilesError);
        return NextResponse.json(
          { error: 'Failed to fetch profiles from database' },
          { status: 500 }
        );
      }

      allProfiles = allProfilesData || [];
    } else if (profileIds.length > 0) {
      // Only fetch specific profiles if no name-based files
      const { data: specificProfiles, error: dbError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, profile_image_url')
        .in('id', profileIds);

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to validate profile IDs against database' },
          { status: 500 }
        );
      }

      allProfiles = specificProfiles || [];
    }

    // Create lookup map for ID-based profiles
    const profileMap = new Map(
      allProfiles.map(p => [p.id, p])
    );

    // Validate ID-based mappings
    const validatedMappings: ImageMapping[] = [];
    const PLACEHOLDER_IMAGE_URL = '/placeholder-profile.svg';

    for (const mapping of mappings) {
      const profile = profileMap.get(mapping.profileId);

      if (!profile) {
        // Profile not found - use placeholder
        errors.push({
          fileName: mapping.fileName,
          error: `Profile ID ${mapping.profileId} not found - will use placeholder image`
        });

        // Still add mapping but mark it to use placeholder
        validatedMappings.push({
          ...mapping,
          profileName: `Unknown Profile (ID: ${mapping.profileId})`,
          currentImageUrl: PLACEHOLDER_IMAGE_URL,
          status: 'ready',
        });
        continue;
      }

      validatedMappings.push({
        ...mapping,
        profileName: profile.name,
        currentImageUrl: profile.profile_image_url || null,
        status: 'ready',
      });
    }

    // Process name-based files
    for (const nameFile of nameBasedFiles) {
      const match = matchNameToProfile(nameFile.extractedName, allProfiles);

      if (match) {
        validatedMappings.push({
          profileId: match.id,
          profileName: `${match.name} (matched from "${nameFile.extractedName}")`,
          currentImageUrl: match.profile_image_url,
          newImagePreview: nameFile.previewUrl,
          fileName: nameFile.filename,
          fileSize: nameFile.fileSize,
          status: 'ready',
        });
      } else {
        // Name not matched - create warning instead of skipping
        errors.push({
          fileName: nameFile.filename,
          error: `Could not match "${nameFile.extractedName}" to any profile - image will be skipped. Use placeholder image manually if needed.`
        });
      }
    }

    // Prepare response
    const response: BulkUploadResponse = {
      mappings: validatedMappings,
      errors,
      stats: {
        total: imageFiles.length,
        matched: validatedMappings.length,
        errors: errors.length,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error processing ZIP file:', error);
    return NextResponse.json(
      {
        error: 'Failed to process ZIP file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
