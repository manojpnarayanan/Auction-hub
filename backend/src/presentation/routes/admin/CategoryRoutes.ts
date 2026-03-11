import { Router } from "express";
import { CategoryController } from "../../controllers/admin/CategoryController";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";
import { ROUTES } from "../../Constant-Route/routes";

const router=Router();



const categoryController=container.get<CategoryController>(TYPES.CategoryController);


router.post(ROUTES.ADMIN.CATEGORY_CREATE,categoryController.create);
router.get(ROUTES.ADMIN.CATEGORY_GET_ALL,categoryController.getAllCategories);
router.put(ROUTES.ADMIN.CATEGORY_UPDATE,categoryController.update);
router.delete(ROUTES.ADMIN.CATEGORY_DELETE,categoryController.delete);

export default router;