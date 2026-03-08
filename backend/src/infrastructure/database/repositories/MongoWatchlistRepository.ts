import { injectable } from "inversify";
import { IWatchlistRepository } from "../../../domain/interfaces/IWatchlistRepository";
import { UserModel } from "../models/UserModel";


@injectable()
export class MongoWatchlistRepository implements IWatchlistRepository{

    async addToWatchlist(userId: string, auctionId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId,{$addToSet:{watchlist:auctionId}});
    }
    async removeFromWatchlist(userId: string, auctionId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId,{
            $pull:{watchlist:auctionId}
        });
    }
    async getWatchlist(userId: string): Promise<string[]> {
        const user=await UserModel.findById(userId).select('watchlist');
        return user?.watchlist ?? []
    }
    async isInWatchlist(userId: string, auctionId: string): Promise<boolean> {
        const user=await UserModel.findOne({_id:userId,watchlist:auctionId});
        return !!user;
    }
}