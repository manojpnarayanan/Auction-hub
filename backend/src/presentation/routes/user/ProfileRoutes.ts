import { Router } from "express";
import { profileController } from "../../controllers/user/ProfileController";
import {TYPES} from '../../../di/types';
import container from "../../../di/container";
import { isUser } from "../../middleware/IsUser";



const router=Router();
const controller=container.get<profileController>(TYPES.profileController)

router.get('/user-profile',isUser,controller.getProfile);
router.put('/user-profile',isUser,controller.updateProfile);
router.put('/change-password',isUser,controller.changeProfilePassword);

export default router;