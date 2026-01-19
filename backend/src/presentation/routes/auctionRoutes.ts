import {Router} from "express";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { AuctionController } from "../controllers/AuctionController";
import {authenticate} from "../middleware/Admin/AuthMiddleware";
import { checkBlockedStatus } from "../middleware/CheckBlockedStatus";
import { isUser } from "../middleware/IsUser";

const auctionRouter=Router();
const auctionController=container.get<AuctionController>(TYPES.AuctionController);


auctionRouter.post('/',authenticate,checkBlockedStatus,auctionController.create);
auctionRouter.get('/all-auctions',authenticate,checkBlockedStatus,auctionController.getMine);
auctionRouter.get('/',isUser,checkBlockedStatus,auctionController.getAll);
auctionRouter.get("/:id",isUser,checkBlockedStatus,auctionController.getAuctionProductDetails);
auctionRouter.put('/:id',authenticate,checkBlockedStatus,auctionController.update);






export default auctionRouter;