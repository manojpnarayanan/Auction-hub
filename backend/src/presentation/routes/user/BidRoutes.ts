import { Router } from "express";
import container from "../../../di/container";
import { BidController } from "../../controllers/user/BidController";
import {TYPES} from "../../../di/types";
import{ isUser } from "../../middleware/IsUser";

const router= Router();
const bidController=container.get<BidController>(TYPES.BidController);

router.post('/',isUser,(req,res,next)=>bidController.placeBid(req,res,next));
router.get('/my-bids',isUser,(req,res,next)=>bidController.getMyBids(req,res,next));
router.get('/:auctionId',(req,res,next)=>bidController.getBids(req,res,next));


export default router;