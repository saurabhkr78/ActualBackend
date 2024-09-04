import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

//config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//upload
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No local file path provided");
            return null;
        }

        console.log("Uploading file to Cloudinary: ", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("Cloudinary upload response: ", response);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary: ", error.message);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};




export {uploadOnCloudinary};