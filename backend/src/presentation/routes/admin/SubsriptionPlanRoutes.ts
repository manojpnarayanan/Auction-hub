import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { SubscriptionPlanController } from "../../controllers/admin/SubscriptionPlanController";

const router = Router()
const subcriptionPlanController = container.get<SubscriptionPlanController>(TYPES.SubscriptionPlanController);



router.post('/create-subscription', subcriptionPlanController.create);
router.get('/subcriptionplans', subcriptionPlanController.getAll);
router.put('/subcriptionplans/:id', subcriptionPlanController.update);
router.delete('/subcriptionplans/:id', subcriptionPlanController.delete);


export default router;