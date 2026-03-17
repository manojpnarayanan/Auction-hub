import { Router } from "express";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";
import {authenticate} from  '../../middleware/Admin/AuthMiddleware';
import {AdminPaymentController} from '../../controllers/admin/AdminWalletController';
import { ROUTES } from "../../Constant-Route/routes";


const router=Router();
const adminPaymentController=container.get<AdminPaymentController>(TYPES.AdminPaymentController);

router.post(ROUTES.ADMIN.ADMIN_RELEASE_PAYMENT,authenticate,adminPaymentController.releasePayment);
router.get('/pending-release',authenticate,adminPaymentController.getPendingRelease);

export default router;