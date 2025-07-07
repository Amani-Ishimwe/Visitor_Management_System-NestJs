import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './dto/cloudinary.response';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';


@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    fileName: string
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Vms_Profile', public_id: fileName },
        (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) return reject(new Error(err.message || 'Upload failed'));
          if (!result) return reject(new Error('No result from Cloudinary'));
          // Assuming CloudinaryResponse matches or can be mapped from UploadApiResponse
          resolve(result as unknown as CloudinaryResponse); // Type cast if needed
        }
      );

      if (file && file.buffer && Buffer.isBuffer(file.buffer)) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else {
        reject(new Error('File buffer is not a valid Buffer'));
      }
    });
  }
}