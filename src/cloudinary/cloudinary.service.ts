import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './dto/cloudinary.response';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';


@Injectable()
export class CloudinaryService {
    async uploadFile(
        file:Express.Multer.File,
        fileName:string
    ):Promise<CloudinaryResponse>{
        return new Promise<CloudinaryResponse>((resolve, reject) =>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder:'Vms_Profile', public_id:fileName},
                (err, result)=>{
                    if(err) return reject(err);
                    if (!result) return reject(new Error('No result from Cloudinary'));
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    } 
}
