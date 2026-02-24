import { Router } from "express";
import container from "../../../di/container";
import {TYPES} from "../../../di/types"
import { isUser } from "../../middleware/IsUser";
import { AddressController } from "../../controllers/user/AddressController";

const router=Router();
const addressController=container.get<AddressController>(TYPES.AddressController);


router.get('/address',isUser,addressController.getAddress);
router.post('/address',isUser,addressController.addAddress);
router.put('/address/:id',isUser,addressController.updateAddress);
router.delete("/address/:id",isUser,addressController.deleteAddress);
router.patch('/address/:id/default',isUser,addressController.setDefault);

export default router;
