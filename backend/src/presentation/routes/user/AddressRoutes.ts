import { Router } from "express";
import container from "../../../di/container";
import {TYPES} from "../../../di/types"
import { isUser } from "../../middleware/IsUser";
import { AddressController } from "../../controllers/user/AddressController";
import { ROUTES } from "../../Constant-Route/routes";

const router=Router();
const addressController=container.get<AddressController>(TYPES.AddressController);


router.get(ROUTES.ADDRESS.ADDRESS_GET,isUser,addressController.getAddress);
router.post(ROUTES.ADDRESS.ADDRESS_ADD,isUser,addressController.addAddress);
router.put(ROUTES.ADDRESS.ADDRESS_UPDATE,isUser,addressController.updateAddress);
router.delete(ROUTES.ADDRESS.ADDRESS_DELETE,isUser,addressController.deleteAddress);
router.patch(ROUTES.ADDRESS.ADDRESS_SET_DEFAULT,isUser,addressController.setDefault);

export default router;
