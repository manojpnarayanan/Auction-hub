import { Router } from "express";
import { CategoryController } from "../../controllers/admin/CategoryController";
import {TYPES} from "../../../di/types";
import container from "../../../di/container";

const router=Router();



const categoryController=container.get<CategoryController>(TYPES.CategoryController);


router.post('/',categoryController.create);
router.get('/',categoryController.getAllCategories);
router.put("/:id",categoryController.update);
router.delete("/:id",categoryController.delete);

export default router;