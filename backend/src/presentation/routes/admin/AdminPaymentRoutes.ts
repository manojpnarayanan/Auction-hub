import { Router } from "express";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";
import {authenticate} from  '../../middleware/Admin/AuthMiddleware';
import {AdminPaymentController} from '../../controllers/admin/AdminWalletController';



const router=Router();
const adminPaymentController=container.get<AdminPaymentController>(TYPES.AdminPaymentController);

router.post('/release/payments',authenticate,adminPaymentController.releasePayment);


export default router;