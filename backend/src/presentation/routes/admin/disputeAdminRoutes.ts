import { Disputecontroller } from "../../controllers/user/DisputeController";
import { Router } from "express";
import container from "../../../di/container";
import {TYPES} from '../../../di/types';
import { ROUTES } from "../../Constant-Route/routes";
import { authenticate } from "../../middleware/Admin/AuthMiddleware";


const router=Router();
const adminDisputeController=container.get<Disputecontroller>(TYPES.DisputeController);


router.get(ROUTES.ADMIN.GET_ALLDISPUTES,authenticate,adminDisputeController.getAllDisputes);
router.post(ROUTES.ADMIN.RESOLVE_DISPUTES,authenticate,adminDisputeController.resolveDispute);



export default router;