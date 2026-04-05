import { Request, Response } from "express";
import logger from "../../infrastructure/Global/Logger";
import cloudinary from "../../infrastructure/config/cloudinary";
import fs from "fs";
import { HttpStatus } from "../Enums/StatusCodes";
import { ApiResponse } from "../Common/APIResponse";
import { CustomMessages } from "../Enums/CustomMessages";


export class UploadController {
    static async uploadImage(req: Request, res: Response) {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length===0) {
                res.status(HttpStatus.BAD_REQUEST).json( ApiResponse.error(CustomMessages.NO_FILE_UPLOADED))
                return;
            };
            const files=req.files as Express.Multer.File[];
            if(files.length>5){
                res.status(HttpStatus.BAD_REQUEST).json( ApiResponse.error(CustomMessages.MAX_IMAGES_EXCEEDED))
                return;
            };
            const uploadPromises=files.map(file=>{
                return cloudinary.uploader.upload(file.path,{
                    folder:"auction-hub",
                    type:"authenticated",
                    access_mode:"authenticated"
                }).then(result=>{
                    fs.unlinkSync(file.path);
                    return {
                        url:result.secure_url,
                        public_id:result.public_id
                    };
                });
            });
            const results=await Promise.all(uploadPromises);
            res.status(HttpStatus.OK).json( ApiResponse.success({ images: results }, CustomMessages.FILE_UPLOADED));
        }catch(error){
            logger.error({ error }, "Upload error");
            res.status(HttpStatus.INERNAL_SERVER_ERROR).json(ApiResponse.error(CustomMessages.IMAGE_UPLOAD_FAILED))
        }
    }
}