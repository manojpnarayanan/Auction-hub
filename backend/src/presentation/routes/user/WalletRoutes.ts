import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { isUser } from "../../middleware/IsUser";
import { WalletController } from "../../controllers/user/WalletController";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = Router();

const walletController = container.get<WalletController>(TYPES.WalletController);


router.get(ROUTES.WALLET.GET_WALLET, isUser,checkBlockedStatus, walletController.getWallet);
router.post(ROUTES.WALLET.CREATE_PAYMENT, isUser,checkBlockedStatus, walletController.createPaymentIntent);
router.post(ROUTES.WALLET.CONFIRM_PAYMENT, isUser,checkBlockedStatus, walletController.confirmPayment);


export default router;
