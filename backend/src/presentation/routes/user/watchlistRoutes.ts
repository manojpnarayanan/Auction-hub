import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { WatchlistController } from "../../controllers/user/WatchlistController";
import { isUser } from "../../middleware/IsUser";
import { ROUTES } from "../../Constant-Route/routes";

const router=Router();
const watchlistcontroller=container.get<WatchlistController>(TYPES.WatchlistController);

router.use(isUser);
router.get(ROUTES.Watchlist.WATCHLIST_GET,watchlistcontroller.getWatchlist);
router.post(ROUTES.Watchlist.WATCHLIST_ADD,watchlistcontroller.addToWatchlist);
router.delete(ROUTES.Watchlist.WATCHLIST_REMOVE,watchlistcontroller.removeFromWatchlist);
router.get(ROUTES.Watchlist.WATCHLIST_CHECK,watchlistcontroller.checkWatchlist)

export default router;