import { Router } from "express";
import { TYPES } from "../../../di/types";
import container from "../../../di/container";
import { SubscriptionController } from "../../controllers/user/SubscriptionController";
import { SubscriptionPlanController } from "../../controllers/admin/SubscriptionPlanController";
import { isUser } from "../../middleware/IsUser";


const router=Router();
const subcriptionController=container.get<SubscriptionController>(TYPES.SubscriptionController);
const subcriptionPlanController=container.get<SubscriptionPlanController>(TYPES.SubscriptionPlanController);

router.get('/plans',subcriptionPlanController.getAll)
router.get('/user-subscription',isUser,subcriptionController.getSubscription);
router.post('/user-subscribe',isUser,subcriptionController.subscribe);
// router.post('/create-checkout',isUser,subcriptionController.createCheckoutSession)
router.post('/create-payment-intent',isUser,subcriptionController.createPaymentIntent);
router.post('/confirm-payment',isUser,subcriptionController.confirmPayment);

export default router;