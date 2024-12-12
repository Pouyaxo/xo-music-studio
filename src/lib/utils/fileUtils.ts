import { supabase } from '../supabase/supabaseClient';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getPublicUrl(bucket: string, path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function ensureBucketExists(bucket: string, options?: {
  public?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
}) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === bucket);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(bucket, {
      public: options?.public ?? true,
      fileSizeLimit: options?.fileSizeLimit,
      allowedMimeTypes: options?.allowedMimeTypes
    });
  }
}

export async function uploadFile(file: File, bucket: string, userId: string): Promise<string> {
  try {
    await ensureBucketExists(bucket, {
      public: true,
      fileSizeLimit: bucket === 'avatars' ? 2 * 1024 * 1024 : 100 * 1024 * 1024,
      allowedMimeTypes: bucket === 'avatars' ? 
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] : undefined
    });

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    return `${bucket}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(path: string): Promise<void> {
  if (!path || !path.includes('/')) return;
  
  const [bucket, ...filePath] = path.split('/');
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath.join('/')]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}