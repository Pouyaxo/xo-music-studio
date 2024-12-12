import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { toast } from 'sonner';

let ffmpeg: FFmpeg | null = null;
let loaded = false;

export async function initFFmpeg(onProgress?: (progress: number) => void) {
  if (loaded) return ffmpeg;
  ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }
  
  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    loaded = true;
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    toast.error('Failed to load audio processing tools');
    throw new Error('Failed to load audio processing tools');
  }
}

export async function convertToMp3(file: File, onProgress?: (progress: number) => void): Promise<File> {
  const toastId = toast.loading('Converting file...', {
    style: {
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff'
    }
  });

  try {
    const ffmpeg = await initFFmpeg(onProgress);
    if (!ffmpeg) throw new Error('FFmpeg not initialized');

    const arrayBuffer = await file.arrayBuffer();
    const inputName = 'input.wav';
    const outputName = 'output.mp3';

    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

    await ffmpeg.exec([
      '-i', inputName,
      '-c:a', 'libmp3lame',
      '-b:a', '320k',
      '-ar', '48000',
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    if (!(data instanceof Uint8Array)) {
      throw new Error('Unexpected output format');
    }

    const mp3Blob = new Blob([new Uint8Array(data)], { type: 'audio/mp3' });
    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
    const mp3FileName = `${originalName}.mp3`;
    
    const convertedFile = new File([mp3Blob], mp3FileName, { type: 'audio/mp3' });
    
    toast.success('File converted successfully', {
      id: toastId,
      style: {
        background: 'rgba(22, 101, 52, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        color: '#fff'
      }
    });

    return convertedFile;
  } catch (error) {
    console.error('Error converting to MP3:', error);
    toast.error('Failed to convert file', {
      id: toastId,
      style: {
        background: 'rgba(153, 27, 27, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#fff'
      }
    });
    throw error;
  }
}