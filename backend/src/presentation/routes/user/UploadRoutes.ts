import { Router } from "express";
import multer from "multer";
import { UploadController } from "../../controllers/UploadController";
import { authenticate } from "../../middleware/Admin/AuthMiddleware";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";




const router = Router();


const upload = multer({ dest: 'uploads/' });


router.post("/",authenticate,checkBlockedStatus, upload.array('images',5), (req, res, next) => {
    UploadController.uploadImage(req, res).catch(next);
});


export default router;