import { Router } from "express";
import { TYPES } from "../../../di/types";
import container from "../../../di/container";
import { SubscriptionController } from "../../controllers/user/SubscriptionController";
import { SubscriptionPlanController } from "../../controllers/admin/SubscriptionPlanController";
import { isUser } from "../../middleware/IsUser";
import { ROUTES } from "../../Constant-Route/routes";



const router=Router();
const subcriptionController=container.get<SubscriptionController>(TYPES.SubscriptionController);
const subcriptionPlanController=container.get<SubscriptionPlanController>(TYPES.SubscriptionPlanController);

router.get(ROUTES.SUBSCRIPTION.USER_PLAN_GET,subcriptionPlanController.getAll)
router.get(ROUTES.SUBSCRIPTION.USER_SUBSCRIPTION_GET,isUser,subcriptionController.getSubscription);
router.post(ROUTES.SUBSCRIPTION.USER_SUBSCRIBE,isUser,subcriptionController.subscribe);
// router.post('/create-checkout',isUser,subcriptionController.createCheckoutSession)
router.post(ROUTES.SUBSCRIPTION.CREATE_PAYMENT_INTENT,isUser,subcriptionController.createPaymentIntent);
router.post(ROUTES.SUBSCRIPTION.CONFIRM_PAYMENT,isUser,subcriptionController.confirmPayment);

export default router;