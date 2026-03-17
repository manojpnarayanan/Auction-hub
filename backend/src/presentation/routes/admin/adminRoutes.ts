import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminDashboardController";
import { AuctionController } from "../../controllers/AuctionController";
import { TYPES } from "../../../di/types";
import container from "../../../di/container";
import { authenticate } from "../../middleware/Admin/AuthMiddleware";
import { ROUTES } from "../../Constant-Route/routes";

const router = Router();


const adminController = container.get<AdminController>(TYPES.AdminController);
const auctionController = container.get<AuctionController>(TYPES.AuctionController);


router.get(ROUTES.ADMIN.GET_USERS, authenticate, adminController.getUsers.bind(adminController));
router.patch(ROUTES.ADMIN.BLOCK_USER, authenticate, adminController.BlockUser.bind(adminController))
router.delete(ROUTES.ADMIN.DELETE_AUCTION, authenticate, auctionController.delete);
router.patch(ROUTES.ADMIN.UPDATE_AUCTION_STATUS, authenticate, auctionController.updateStatus)

export default router;