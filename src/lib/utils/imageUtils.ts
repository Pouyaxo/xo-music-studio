export async function compressImage(file: File, maxSizeMB: number = 2): Promise<File> {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  // If file is already smaller than max size, return it immediately
  if (file.size <= maxSize) {
    return file;
  }

  console.log(`File size (${file.size} bytes) exceeds ${maxSize} bytes, compressing...`);

  // Create canvas and context
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Create image object
  const img = new Image();
  img.src = URL.createObjectURL(file);

  // Wait for image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Calculate new dimensions while maintaining aspect ratio
  let width = img.width;
  let height = img.height;
  const maxDimension = 1200; // Max width/height

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw image on canvas
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob with decreasing quality until size is under limit
  let quality = 0.8;
  let blob: Blob;
  
  do {
    blob = await new Promise((resolve) => 
      canvas.toBlob(resolve as BlobCallback, 'image/jpeg', quality)
    );
    quality -= 0.1;
  } while (blob.size > maxSize && quality > 0.1);

  // Clean up
  URL.revokeObjectURL(img.src);

  // Convert blob to File
  return new File([blob], file.name, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
} 