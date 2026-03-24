import { Router } from "express";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";
import {authenticate} from  '../../middleware/Admin/AuthMiddleware';
import { ROUTES } from "../../Constant-Route/routes";
import { AdminController } from "../../controllers/admin/AdminDashboardController";

const router=Router();

const adminDashboardController=container.get<AdminController>(TYPES.AdminController)

router.get(ROUTES.ADMIN.GET_ADMINDASHBOARD,authenticate,adminDashboardController.getStats)

export default router;