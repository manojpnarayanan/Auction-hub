import { Router } from "express";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { WatchlistController } from "../../controllers/user/WatchlistController";
import { isUser } from "../../middleware/IsUser";


const router=Router();
const watchlistcontroller=container.get<WatchlistController>(TYPES.WatchlistController);

router.use(isUser);
router.get('/watchlist',watchlistcontroller.getWatchlist);
router.post('/watchlist/:auctionId',watchlistcontroller.addToWatchlist);
router.delete("/watchlist/:auctionId",watchlistcontroller.removeFromWatchlist);
router.get("/watchlist/:auctionId/check",watchlistcontroller.checkWatchlist)

export default router;