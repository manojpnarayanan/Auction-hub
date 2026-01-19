import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminDashboardController";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";

const router=Router();


const adminController=container.get<AdminController>(TYPES.AdminController);
router.get("/users",adminController.getUsers.bind(adminController));
router.patch('/users/:userId/block',adminController.BlockUser.bind(adminController))


export default router;