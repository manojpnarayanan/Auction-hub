import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types"
import { isUser } from "../../middleware/IsUser";
import { AddressController } from "../../controllers/user/AddressController";
import { ROUTES } from "../../Constant-Route/routes";
import { checkBlockedStatus } from "../../middleware/CheckBlockedStatus";

const router = Router();
const addressController = container.get<AddressController>(TYPES.AddressController);


router.get(ROUTES.ADDRESS.ADDRESS_GET, isUser,checkBlockedStatus, addressController.getAddress);
router.post(ROUTES.ADDRESS.ADDRESS_ADD, isUser,checkBlockedStatus, addressController.addAddress);
router.put(ROUTES.ADDRESS.ADDRESS_UPDATE, isUser,checkBlockedStatus, addressController.updateAddress);
router.delete(ROUTES.ADDRESS.ADDRESS_DELETE, isUser,checkBlockedStatus, addressController.deleteAddress);
router.patch(ROUTES.ADDRESS.ADDRESS_SET_DEFAULT, isUser,checkBlockedStatus, addressController.setDefault);

export default router;
