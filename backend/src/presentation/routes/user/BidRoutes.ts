import { Router } from "express";
import container from "../../../di/container";
import { BidController } from "../../controllers/user/BidController";
import { TYPES } from "../../../di/types";
import { isUser } from "../../middleware/IsUser";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = Router();
const bidController = container.get<BidController>(TYPES.BidController);

router.post(ROUTES.BID.BID_PLACE, isUser,checkBlockedStatus, (req, res, next) => bidController.placeBid(req, res, next));
router.get(ROUTES.BID.BID_GET_MINE, isUser,checkBlockedStatus, (req, res, next) => bidController.getMyBids(req, res, next));
router.get(ROUTES.BID.BID_GET_AUCTION, (req, res, next) => bidController.getBids(req, res, next));


export default router;