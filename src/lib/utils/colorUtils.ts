"use client";

export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('rgb(0, 0, 0)'); // Fallback color
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Darken the color for better contrast
        const darkenFactor = 0.6;
        r = Math.floor(r * darkenFactor);
        g = Math.floor(g * darkenFactor);
        b = Math.floor(b * darkenFactor);

        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.error('Error extracting color:', error);
        resolve('rgb(0, 0, 0)'); // Fallback color
      }
    };

    img.onerror = () => {
      resolve('rgb(0, 0, 0)'); // Fallback color
    };

    img.src = imageUrl;
  });
}