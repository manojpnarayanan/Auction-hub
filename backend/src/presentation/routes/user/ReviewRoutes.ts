import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { isUser } from "../../middleware/IsUser";
import { ReviewController } from "../../controllers/user/ReviewController";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = Router();
const reviewController = container.get<ReviewController>(TYPES.ReviewController);


router.post(ROUTES.rating.ADD_REVIEW, isUser,checkBlockedStatus, reviewController.addReview);
router.get(ROUTES.rating.GETSELLER_REVIEW, reviewController.getSellerReviews);



export default router;