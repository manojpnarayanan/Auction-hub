import { Request, Response } from "express";
import cloudinary from "../../infrastructure/config/cloudinary";
import fs from "fs";

export class UploadController {
    static async uploadImage(req: Request, res: Response) {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length===0) {
                res.status(400).json({ success: false, message: "No file uploaded" })
                return;
            };
            const files=req.files as Express.Multer.File[];
            if(files.length>5){
                res.status(400).json({success:false,message:"Maximum 5 images allowed"})
                return;
            };
            const uploadPromises=files.map(file=>{
                return cloudinary.uploader.upload(file.path,{
                    folder:"auction-hub"
                }).then(result=>{
                    fs.unlinkSync(file.path);
                    return {
                        url:result.secure_url,
                        public_id:result.public_id
                    };
                });
            });
            const results=await Promise.all(uploadPromises);
            res.status(200).json({success:true,images:results});
        }catch(error){
            console.error("Upload error",error);
            res.status(500).json({success:false,message:"Image upload failed"})
        }
    }
}