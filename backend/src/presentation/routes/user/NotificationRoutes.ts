import express from "express";
import container from "../../../di/container";
import {TYPES} from '../../../di/types';
import { NotificationController } from "../../controllers/user/NotificationController";
import { isUser } from "../../middleware/IsUser";


const router=express.Router();
const notificationController=container.get<NotificationController>(TYPES.NotificationController);

router.get("/notifications",isUser,notificationController.getNotification);
router.patch('/notifications/:id',isUser,notificationController.markAsRead);

export default router;