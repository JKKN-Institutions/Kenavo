import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import {
  extractProfileIdFromFilename,
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

        // Extract profile ID from filename
        const profileId = extractProfileIdFromFilename(baseFilename);
        if (!profileId) {
          errors.push({
            fileName: baseFilename,
            error: 'Could not extract profile ID from filename. Use format: {id}.jpg or {id}-name.jpg'
          });
          continue;
        }

        // Store profile ID for batch lookup
        if (!profileIds.includes(profileId)) {
          profileIds.push(profileId);
        }

        // Create preview data URL
        const mimeType = fileBlob.type || 'image/jpeg';
        const previewUrl = await createImageDataUrl(fileBlob, mimeType);

        // Temporarily store mapping (will validate against DB later)
        mappings.push({
          profileId,
          profileName: '', // Will be filled after DB query
          currentImageUrl: null, // Will be filled after DB query
          newImagePreview: previewUrl,
          fileName: baseFilename,
          fileSize: fileBlob.size,
          status: 'ready',
        });

      } catch (error) {
        const baseFilename = filename.split('/').pop() || filename;
        errors.push({
          fileName: baseFilename,
          error: error instanceof Error ? error.message : 'Failed to process file'
        });
      }
    }

    // Query database to validate profile IDs and get current data
    if (profileIds.length > 0) {
      const { data: profiles, error: dbError } = await supabaseAdmin
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

      // Create lookup map for profiles
      const profileMap = new Map(
        profiles?.map(p => [p.id, p]) || []
      );

      // Update mappings with profile data and validate
      const validatedMappings: ImageMapping[] = [];

      for (const mapping of mappings) {
        const profile = profileMap.get(mapping.profileId);

        if (!profile) {
          // Profile ID doesn't exist in database
          errors.push({
            fileName: mapping.fileName,
            error: `Profile ID ${mapping.profileId} not found in database`
          });
          continue;
        }

        // Update mapping with profile data
        validatedMappings.push({
          ...mapping,
          profileName: profile.name,
          currentImageUrl: profile.profile_image_url || null,
          status: 'ready',
        });
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
    }

    // No valid profile IDs found
    return NextResponse.json({
      mappings: [],
      errors,
      stats: {
        total: imageFiles.length,
        matched: 0,
        errors: errors.length,
      },
    }, { status: 200 });

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
