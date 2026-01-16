import {Router} from "express";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { AuctionController } from "../controllers/AuctionController";
import {authenticate} from "../middleware/Admin/AuthMiddleware";
import { doesNotMatch } from "assert";


const auctionRouter=Router();
const auctionController=container.get<AuctionController>(TYPES.AuctionController);


auctionRouter.post('/',authenticate,auctionController.create);
auctionRouter.get('/all-auctions',authenticate,auctionController.getMine);
auctionRouter.get('/',auctionController.getAll);
export default auctionRouter;