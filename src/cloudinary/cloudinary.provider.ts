import { Provider } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryProvider: Provider = {
    provide: 'CLOUDINARY_PROVIDER',
    useFactory: () => {
        return cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
    }
};