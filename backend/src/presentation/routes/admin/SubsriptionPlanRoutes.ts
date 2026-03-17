import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { SubscriptionPlanController } from "../../controllers/admin/SubscriptionPlanController";
import { ROUTES } from "../../Constant-Route/routes";


const router = Router()
const subcriptionPlanController = container.get<SubscriptionPlanController>(TYPES.SubscriptionPlanController);



router.post(ROUTES.SUBSCRIPTION.CREATE_PLAN, subcriptionPlanController.create);
router.get(ROUTES.SUBSCRIPTION.GET_ALL_PLAN, subcriptionPlanController.getAll);
router.put(ROUTES.SUBSCRIPTION.UPDATE_PLAN, subcriptionPlanController.update);
router.delete(ROUTES.SUBSCRIPTION.DELETE_PLAN, subcriptionPlanController.delete);


export default router;