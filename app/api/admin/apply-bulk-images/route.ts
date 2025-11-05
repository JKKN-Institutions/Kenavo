import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import {
  extractProfileIdFromFilename,
  extractPathFromUrl,
  generateStorageFilename,
  getFileExtension,
  blobToArrayBuffer,
} from '@/lib/bulk-image-handler';

export const dynamic = 'force-dynamic';

// Interface for mapping input
interface ImageMappingInput {
  profileId: number;
  profileName: string;
  currentImageUrl: string | null;
  fileName: string;
}

// Interface for operation result
interface OperationResult {
  profileId: number;
  profileName: string;
  success: boolean;
  newUrl?: string;
  error?: string;
}

// Interface for deletion warning
interface DeletionWarning {
  profileId: number;
  oldPath: string;
  error: string;
}

// Response interface
interface ApplyBulkImagesResponse {
  successful: OperationResult[];
  failed: OperationResult[];
  deletionWarnings: DeletionWarning[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    deletionWarnings: number;
  };
}

export async function POST(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    // Get form data with ZIP file and mappings
    const formData = await request.formData();
    const zipFile = formData.get('zipFile') as File;
    const mappingsJson = formData.get('mappings') as string;

    if (!zipFile) {
      return NextResponse.json(
        { error: 'No ZIP file provided' },
        { status: 400 }
      );
    }

    if (!mappingsJson) {
      return NextResponse.json(
        { error: 'No mappings provided' },
        { status: 400 }
      );
    }

    // Parse mappings
    let mappings: ImageMappingInput[];
    try {
      mappings = JSON.parse(mappingsJson);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid mappings format' },
        { status: 400 }
      );
    }

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return NextResponse.json(
        { error: 'Mappings must be a non-empty array' },
        { status: 400 }
      );
    }

    // Load ZIP file
    const zipBuffer = await zipFile.arrayBuffer();
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer);

    // Create filename to mapping lookup
    const fileMap = new Map<string, ImageMappingInput>();
    for (const mapping of mappings) {
      fileMap.set(mapping.fileName, mapping);
    }

    const successful: OperationResult[] = [];
    const failed: OperationResult[] = [];
    const deletionWarnings: DeletionWarning[] = [];

    // Process each mapping
    for (const mapping of mappings) {
      try {
        // Find file in ZIP
        let zipEntry = zipContent.files[mapping.fileName];

        // If not found directly, try with folder paths
        if (!zipEntry) {
          const matchingKey = Object.keys(zipContent.files).find(key => {
            const baseFilename = key.split('/').pop();
            return baseFilename === mapping.fileName;
          });
          if (matchingKey) {
            zipEntry = zipContent.files[matchingKey];
          }
        }

        if (!zipEntry) {
          failed.push({
            profileId: mapping.profileId,
            profileName: mapping.profileName,
            success: false,
            error: `File ${mapping.fileName} not found in ZIP`
          });
          continue;
        }

        // Extract file as blob
        const fileBlob = await zipEntry.async('blob');
        const fileBuffer = await blobToArrayBuffer(fileBlob);

        // Step 1: Upload new image to Supabase Storage
        const fileExtension = getFileExtension(mapping.fileName);
        const storageFilename = generateStorageFilename(mapping.profileId, fileExtension);
        const storagePath = `profiles/${storageFilename}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('profile-images')
          .upload(storagePath, fileBuffer, {
            contentType: fileBlob.type || 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Step 2: Get public URL for uploaded image
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('profile-images')
          .getPublicUrl(storagePath);

        if (!publicUrl) {
          throw new Error('Failed to generate public URL');
        }

        // Step 3: Update database with new image URL
        const { error: dbError } = await supabaseAdmin
          .from('profiles')
          .update({ profile_image_url: publicUrl })
          .eq('id', mapping.profileId);

        if (dbError) {
          throw new Error(`Database update failed: ${dbError.message}`);
        }

        // Step 4: Safe deletion - only after successful upload and DB update
        if (mapping.currentImageUrl && mapping.currentImageUrl.includes('profile-images')) {
          try {
            const oldPath = extractPathFromUrl(mapping.currentImageUrl);

            if (oldPath) {
              const { error: deleteError } = await supabaseAdmin.storage
                .from('profile-images')
                .remove([oldPath]);

              if (deleteError) {
                // Log warning but don't fail the operation
                console.warn(`Failed to delete old image for profile ${mapping.profileId}:`, deleteError);
                deletionWarnings.push({
                  profileId: mapping.profileId,
                  oldPath,
                  error: deleteError.message
                });
              }
            }
          } catch (deleteError) {
            // Catch any deletion errors and log as warning
            console.warn(`Error during deletion for profile ${mapping.profileId}:`, deleteError);
            deletionWarnings.push({
              profileId: mapping.profileId,
              oldPath: extractPathFromUrl(mapping.currentImageUrl),
              error: deleteError instanceof Error ? deleteError.message : 'Unknown deletion error'
            });
          }
        }

        // Success!
        successful.push({
          profileId: mapping.profileId,
          profileName: mapping.profileName,
          success: true,
          newUrl: publicUrl
        });

      } catch (error) {
        // Log error and continue with next mapping
        console.error(`Error processing profile ${mapping.profileId}:`, error);
        failed.push({
          profileId: mapping.profileId,
          profileName: mapping.profileName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }

    // Prepare response
    const response: ApplyBulkImagesResponse = {
      successful,
      failed,
      deletionWarnings,
      summary: {
        total: mappings.length,
        successful: successful.length,
        failed: failed.length,
        deletionWarnings: deletionWarnings.length
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error applying bulk images:', error);
    return NextResponse.json(
      {
        error: 'Failed to apply bulk images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
