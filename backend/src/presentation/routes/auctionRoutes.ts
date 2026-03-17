import {Router} from "express";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { AuctionController } from "../controllers/AuctionController";
import {authenticate} from "../middleware/Admin/AuthMiddleware";
import { checkBlockedStatus } from "../middleware/CheckBlockedStatus";
import { isUser } from "../middleware/IsUser";
import { ROUTES } from "../Constant-Route/routes";

const auctionRouter=Router();
const auctionController=container.get<AuctionController>(TYPES.AuctionController);


auctionRouter.post(ROUTES.AUCTION.CREATE,authenticate,checkBlockedStatus,auctionController.create);
auctionRouter.get(ROUTES.AUCTION.GET_MINE,authenticate,checkBlockedStatus,auctionController.getMine);
auctionRouter.get(ROUTES.AUCTION.GET_ALL,isUser,checkBlockedStatus,auctionController.getAll);
auctionRouter.get(ROUTES.AUCTION.GET_DETAILS,isUser,checkBlockedStatus,auctionController.getAuctionProductDetails);
auctionRouter.put(ROUTES.AUCTION.UPDATE,authenticate,checkBlockedStatus,auctionController.update);
auctionRouter.post(ROUTES.AUCTION.START_LIVE,isUser,auctionController.startLiveAuction);
auctionRouter.post(ROUTES.AUCTION.END_LIVE,isUser,auctionController.endLiveAuction);
auctionRouter.post(ROUTES.AUCTION.CANCEL_LIVE,isUser,auctionController.cancelLiveAuction);
auctionRouter.post(ROUTES.AUCTION.REQUEST_CANCELLATION,isUser,checkBlockedStatus,auctionController.requestCancellation);



export default auctionRouter;