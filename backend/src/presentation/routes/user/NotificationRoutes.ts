import express from "express";
import container from "../../../di/container";
import { TYPES } from '../../../di/types';
import { NotificationController } from "../../controllers/user/NotificationController";
import { isUser } from "../../middleware/IsUser";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = express.Router();
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

router.get(ROUTES.NOTIFICATION.GET_NOTIFICATION, isUser,checkBlockedStatus, notificationController.getNotification);
router.patch(ROUTES.NOTIFICATION.MARK_READ, isUser,checkBlockedStatus, notificationController.markAsRead);

export default router;