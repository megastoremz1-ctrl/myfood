/**
 * MyFood File Storage Service
 * 
 * Wraps Supabase Storage for:
 * - Menu item images (partner uploads)
 * - Restaurant logos and covers
 * - User avatars
 * - Delivery proof photos
 * 
 * Storage Buckets:
 * - 'menu-images': Restaurant menu item photos
 * - 'restaurant-assets': Logos and cover images
 * - 'avatars': User profile pictures
 * - 'delivery-photos': Proof of delivery
 */

import { getSupabase } from './supabase';

export type StorageBucket = 'menu-images' | 'restaurant-assets' | 'avatars' | 'delivery-photos';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * 
 * @param bucket - Storage bucket name
 * @param file - File to upload
 * @param folder - Optional subfolder (e.g., restaurant ID)
 * @returns Upload result with public URL
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<UploadResult> {
  const supabase = getSupabase();

  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { success: false, error: 'Ficheiro muito grande. Maximo 5MB.' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Tipo de ficheiro nao suportado. Use JPG, PNG ou WEBP.' };
  }

  // Generate unique filename
  const extension = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${randomId}.${extension}`;
  const path = folder ? `${folder}/${filename}` : filename;

  // Upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[Storage] Upload error:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    success: true,
    url: urlData.publicUrl,
    path: data.path,
  };
}

/**
 * Upload a menu item image
 */
export async function uploadMenuImage(file: File, restaurantId: string): Promise<UploadResult> {
  return uploadFile('menu-images', file, restaurantId);
}

/**
 * Upload a restaurant logo or cover
 */
export async function uploadRestaurantAsset(
  file: File,
  restaurantId: string,
  type: 'logo' | 'cover'
): Promise<UploadResult> {
  return uploadFile('restaurant-assets', file, `${restaurantId}/${type}`);
}

/**
 * Upload a user avatar
 */
export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
  return uploadFile('avatars', file, userId);
}

/**
 * Upload a delivery proof photo
 */
export async function uploadDeliveryPhoto(file: File, orderId: string): Promise<UploadResult> {
  return uploadFile('delivery-photos', file, orderId);
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('[Storage] Delete error:', error);
    return false;
  }

  return true;
}

/**
 * List files in a folder
 */
export async function listFiles(bucket: StorageBucket, folder: string): Promise<string[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('[Storage] List error:', error);
    return [];
  }

  return data.map((file: { name: string }) => {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${folder}/${file.name}`);
    return urlData.publicUrl;
  });
}

/**
 * Get public URL for a stored file
 */
export function getFileUrl(bucket: StorageBucket, path: string): string {
  const supabase = getSupabase();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload from a data URL (base64) - converts to File first
 * Useful when the image was captured from canvas or file reader
 */
export async function uploadFromDataUrl(
  bucket: StorageBucket,
  dataUrl: string,
  folder?: string,
  filename?: string
): Promise<UploadResult> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create file from blob
    const extension = blob.type.split('/')[1] || 'png';
    const name = filename || `upload-${Date.now()}.${extension}`;
    const file = new File([blob], name, { type: blob.type });

    return uploadFile(bucket, file, folder);
  } catch (error) {
    console.error('[Storage] DataURL upload error:', error);
    return { success: false, error: 'Erro ao processar imagem.' };
  }
}
