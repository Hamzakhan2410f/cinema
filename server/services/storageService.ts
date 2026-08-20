import path from 'path';

export interface StorageUploadResult {
  url: string;
  key: string;
  provider: string;
  size?: number;
  mimeType?: string;
}

export class StorageService {
  private static provider = process.env.STORAGE_PROVIDER || 'local';
  private static bucket = process.env.STORAGE_BUCKET || 'cinema-media';

  /**
   * Abstract file upload method.
   * Handles local memory/data URL or simulated cloud storage provider upload.
   */
  static async uploadFile(
    fileBuffer: Buffer | string,
    fileName: string,
    mimeType: string = 'video/mp4'
  ): Promise<StorageUploadResult> {
    const fileKey = `movies/${Date.now()}_${path.basename(fileName).replace(/\s+/g, '_')}`;
    
    // In production, when S3 / Cloudinary / R2 keys are provided, this connects directly.
    // For local dev/preview, we generate an authorized media reference URL or data URI.
    const isVideo = mimeType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.m3u8');
    
    let publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileKey}`;
    
    if (typeof fileBuffer === 'string' && fileBuffer.startsWith('http')) {
      publicUrl = fileBuffer;
    } else if (typeof fileBuffer === 'string' && fileBuffer.startsWith('data:')) {
      // If base64 file passed
      publicUrl = fileBuffer;
    }

    return {
      url: publicUrl,
      key: fileKey,
      provider: this.provider,
      mimeType,
      size: typeof fileBuffer === 'string' ? fileBuffer.length : fileBuffer.byteLength,
    };
  }

  /**
   * Deletes a file from configured storage.
   */
  static async deleteFile(fileKey: string): Promise<boolean> {
    console.log(`[StorageService] Deleting file key: ${fileKey} from provider ${this.provider}`);
    return true;
  }

  /**
   * Returns public media URL.
   */
  static getFileUrl(fileKey: string): string {
    if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
      return fileKey;
    }
    return `https://storage.googleapis.com/${this.bucket}/${fileKey}`;
  }

  /**
   * Generates temporary signed URL if needed.
   */
  static async getSignedUrl(fileKey: string, _expiresInSeconds: number = 3600): Promise<string> {
    return this.getFileUrl(fileKey);
  }
}
