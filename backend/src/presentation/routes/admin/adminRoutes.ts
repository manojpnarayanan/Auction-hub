import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminDashboardController";
import { AuctionController } from "../../controllers/AuctionController";
import { TYPES } from "../../../di/types";
import container from "../../../di/container";
import { authenticate } from "../../middleware/Admin/AuthMiddleware";

const router = Router();


const adminController = container.get<AdminController>(TYPES.AdminController);
const auctionController = container.get<AuctionController>(TYPES.AuctionController);


router.get("/users", authenticate, adminController.getUsers.bind(adminController));
router.patch('/users/:userId/block', authenticate, adminController.BlockUser.bind(adminController))
router.delete('/auctions/:id', authenticate, auctionController.delete);
router.patch('/auctions/:id/status', authenticate, auctionController.updateStatus)

export default router;