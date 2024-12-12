import { supabase } from '../supabase/supabaseClient';

// Storage bucket constants
export const STORAGE_BUCKETS = {
  TRACKS: 'tracks',
  STEMS: 'stems', 
  COVERS: 'covers',
  AVATARS: 'avatars',
  SOUND_KITS: 'sound_kits',
  SOUND_KITS_COVERS: 'sound_kits_covers',
  SOUND_KIT_PREVIEWS: 'sound_kit_previews'
} as const;

// Bucket configurations
const BUCKET_CONFIGS = {
  [STORAGE_BUCKETS.TRACKS]: {
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav'] as string[],
    maxSize: 100 * 1024 * 1024, // 100MB
    public: true
  },
  [STORAGE_BUCKETS.AVATARS]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    maxSize: 2 * 1024 * 1024, // 2MB
    public: true
  },
  [STORAGE_BUCKETS.COVERS]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
    maxSize: 5 * 1024 * 1024, // 5MB
    public: true
  },
  [STORAGE_BUCKETS.SOUND_KITS_COVERS]: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
    maxSize: 5 * 1024 * 1024, // 5MB
    public: true
  },
  [STORAGE_BUCKETS.STEMS]: {
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'application/zip'] as string[],
    maxSize: 100 * 1024 * 1024, // 100MB
    public: true
  },
  [STORAGE_BUCKETS.SOUND_KITS]: {
    mimeTypes: ['application/zip', 'application/x-zip-compressed'] as string[],
    maxSize: 500 * 1024 * 1024, // 500MB
    public: true
  },
  [STORAGE_BUCKETS.SOUND_KIT_PREVIEWS]: {
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
    maxSize: 10 * 1024 * 1024, // 10MB
    public: true
  }
} as const;

function extractPathComponents(path: string): {
  bucket: string;
  userId: string;
  contentId: string;
  fileName: string;
} {
  const parts = path.split('/');
  return {
    bucket: parts[0],
    userId: parts[1],
    contentId: parts[2],
    fileName: parts.slice(3).join('/')
  };
}

function buildStoragePath(
  bucket: string,
  userId: string,
  contentId: string,
  fileName: string,
  type?: 'tagged' | 'untagged' | null,
  existingPath?: string
): string {
  // If we have an existing path, preserve the folder structure
  if (existingPath) {
    const components = extractPathComponents(existingPath);
    userId = components.userId;
    contentId = components.contentId;
  }

  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const cleanName = cleanFileName(nameWithoutExt);

  switch (bucket) {
    case STORAGE_BUCKETS.TRACKS: {
      const suffix = type ? ` - ${type.charAt(0).toUpperCase() + type.slice(1)}` : '';
      return `${userId}/${contentId}/${cleanName}${suffix}.${ext}`;
    }
    case STORAGE_BUCKETS.STEMS: {
      const nameWithoutExt = fileName.split('.')[0].replace(/ - Stems$/, '');
      return `${userId}/${contentId}/${nameWithoutExt} - Stems.zip`;
    }
    case STORAGE_BUCKETS.COVERS:
    case STORAGE_BUCKETS.SOUND_KITS_COVERS: {
      return `${userId}/${contentId}/${fileName}`;
    }
    case STORAGE_BUCKETS.SOUND_KITS: {
      const nameWithoutExt = fileName.endsWith('.zip') ? 
        fileName.slice(0, -4) : fileName;
      return `${userId}/${contentId}/${nameWithoutExt}.zip`;
    }
    case STORAGE_BUCKETS.AVATARS:
      return `${userId}/avatar.jpg`;
    case STORAGE_BUCKETS.SOUND_KIT_PREVIEWS: {
      const suffix = " - Preview";
      return `${userId}/${contentId}/${cleanName}${suffix}.${ext}`;
    }
    default:
      throw new Error(`Invalid bucket: ${bucket}`);
  }
}

export async function renameFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  oldPath: string,
  newFileName: string,
  userId: string,
  contentId: string,
  type?: 'tagged' | 'untagged'
): Promise<string> {
  try {
    const cleanOldPath = oldPath.replace(`${bucket}/`, '');
    const newPath = buildStoragePath(bucket, userId, contentId, newFileName, type, oldPath);
    
    const { error: moveError } = await supabase.storage
      .from(bucket)
      .move(cleanOldPath, newPath);

    if (moveError) {
      throw new Error(`Failed to rename file: ${moveError.message}`);
    }

    return `${bucket}/${newPath}`;
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
}

export async function uploadFile(
  file: File | null,
  bucket: string,
  userId: string,
  contentId: string,
  fileName: string,
  type?: 'tagged' | 'untagged',
  existingPath?: string
): Promise<string> {
  try {
    let actualUserId = userId;
    let actualContentId = contentId;
    
    // Handle existing files for tracks and stems
    if (bucket === STORAGE_BUCKETS.TRACKS || bucket === STORAGE_BUCKETS.STEMS) {
      const { data: existingFiles } = await supabase.storage
        .from(bucket)
        .list(`${userId}`);

      console.log(`Checking existing ${bucket} files:`, {
        userId,
        contentId,
        existingFiles
      });

      // Look for any folder containing files for this track/stem
      if (existingFiles) {
        for (const item of existingFiles) {
          if (item.name.includes(contentId)) {
            actualUserId = userId;
            actualContentId = contentId;
            console.log(`Found existing ${bucket} folder:`, {
              actualUserId,
              actualContentId
            });
            break;
          }
        }
      }
    }
    // For existing paths (renames/updates), always use the original folder structure
    else if (existingPath) {
      const cleanPath = existingPath.split('?')[0].replace(`${bucket}/`, '');
      const pathParts = cleanPath.split('/');
      actualUserId = pathParts[0];
      actualContentId = pathParts[1];
    }

    // Build the new filename
    let finalFileName: string;
    if (bucket === STORAGE_BUCKETS.STEMS) {
      const nameWithoutExt = fileName.split('.')[0].replace(/ - Stems$/, '');
      finalFileName = `${nameWithoutExt} - Stems.zip`;
    } else if (bucket === STORAGE_BUCKETS.SOUND_KIT_PREVIEWS) {
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const cleanName = cleanFileName(nameWithoutExt);
      finalFileName = `${cleanName} - Preview.${ext}`;
    } else if (bucket === STORAGE_BUCKETS.SOUND_KITS) {
      finalFileName = fileName.endsWith('.zip') ? fileName : `${fileName}.zip`;
    } else {
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const cleanName = cleanFileName(nameWithoutExt);
      const suffix = type ? ` - ${type.charAt(0).toUpperCase() + type.slice(1)}` : '';
      finalFileName = `${cleanName}${suffix}.${ext}`;
    }

    // Always use the same folder structure
    const newPath = `${actualUserId}/${actualContentId}/${finalFileName}`;

    if (existingPath) {
      const cleanOldPath = existingPath.split('?')[0].replace(`${bucket}/`, '');
      
      if (!file) {
        // Rename operation
        const { error: moveError } = await supabase.storage
          .from(bucket)
          .move(cleanOldPath, newPath);

        if (moveError) {
          console.error('Move error:', moveError);
          throw moveError;
        }
      } else {
        // Update operation - remove old file first
        try {
          await supabase.storage
            .from(bucket)
            .remove([cleanOldPath]);
        } catch (error) {
          console.warn('Error removing old file:', error);
        }

        // Upload new file in same location
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(newPath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
      }
    } else if (file) {
      // New file upload
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(newPath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
    }

    return `${bucket}/${newPath}`;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

export async function initializeBuckets() {
  if (typeof window !== 'undefined') return; // Only run on server

  try {
    const buckets = [
      'tracks', 
      'stems', 
      'covers', 
      'sound_kits',
      'sound_kits_covers',
      'sound_kit_previews'
    ];
    
    await Promise.all(
      buckets.map(async (bucket) => {
        const { data, error } = await supabase.storage.getBucket(bucket);
        if (!data && !error) {
          await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 100, // 100MB
          });
        }
      })
    );
  } catch (error) {
    console.warn('Bucket initialization skipped:', error);
  }
}

function cleanFileName(name: string): string {
  return name
    .replace(/[^\w\s$&'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getStorageUrl(path: string | null): string {
  if (!path) return "/images/default-cover.jpg";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}