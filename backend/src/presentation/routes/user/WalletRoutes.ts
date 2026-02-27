import { Router} from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { isUser } from "../../middleware/IsUser";
import { WalletController } from "../../controllers/user/WalletController";


const router=Router();

const walletController=container.get<WalletController>(TYPES.WalletController);


router.get('/getwallet',isUser,walletController.getWallet);
router.post('/payment',isUser,walletController.createPaymentIntent);
router.post('/payment/confirm',isUser,walletController.confirmPayment);


export default router;
