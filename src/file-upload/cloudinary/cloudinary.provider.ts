import { Provider } from "@nestjs/common"
import { v2 as cloudinary } from "cloudinary"


export const cloudinaryProvider:Provider = {
    provide: "CLOUDINARY",
    useFactory: () => {
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        })
        //it will return configured cloudinary instance
        return cloudinary
    }
}