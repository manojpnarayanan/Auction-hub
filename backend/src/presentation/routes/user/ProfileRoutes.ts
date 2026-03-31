import { Router } from "express";
import { profileController } from "../../controllers/user/ProfileController";
import { TYPES } from '../../../di/types';
import container from "../../../di/container";
import { isUser } from "../../middleware/IsUser";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = Router();
const controller = container.get<profileController>(TYPES.profileController)

router.get(ROUTES.USER.PROFILE_GET, isUser,checkBlockedStatus, controller.getProfile);
router.put(ROUTES.USER.PROFILE_UPDATE, isUser,checkBlockedStatus, controller.updateProfile);
router.put(ROUTES.USER.PROFILE_CHANGE_PASSWORD, isUser,checkBlockedStatus, controller.changeProfilePassword);

export default router;