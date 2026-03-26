import { Disputecontroller } from "../../controllers/user/DisputeController";
import { Router } from "express";
import container from "../../../di/container";
import {TYPES} from '../../../di/types';
import { ROUTES } from "../../Constant-Route/routes";
import { isUser } from "../../middleware/IsUser";


const router=Router();
const disputeController=container.get<Disputecontroller>(TYPES.DisputeController);


router.post(ROUTES.DISPUTE.CONFIRM_DELIVERY,isUser,disputeController.ConfirmDelivery);
router.post(ROUTES.DISPUTE.RAISE_DISPUTE,isUser,disputeController.raiseDispute);
router.get(ROUTES.DISPUTE.BUYER_DISPUTE,isUser,disputeController.getBuyerDisputes);


export default router;

