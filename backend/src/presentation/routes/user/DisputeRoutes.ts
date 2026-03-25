import { Disputecontroller } from "../../controllers/user/DisputeController";
import { Router } from "express";
import container from "../../../di/container";
import {TYPES} from '../../../di/types';
import { ROUTES } from "../../Constant-Route/routes";
import { isUser } from "../../middleware/IsUser";

const router=Router();
const disputeController=container.get<Disputecontroller>(TYPES.DisputeController);


router.post('/dispute/confirm-delivery',isUser,disputeController.ConfirmDelivery);
router.post('/dispute/raise',isUser,disputeController.raiseDispute);
router.get('/dispute',isUser,disputeController.getBuyerDisputes);


export default router;

