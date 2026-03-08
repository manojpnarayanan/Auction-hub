

export interface IWatchlistRepository{
    addToWatchlist(userId:string,auctionId:string):Promise<void>;
    removeFromWatchlist(userId:string,auctionId:string):Promise<void>;
    getWatchlist(userId:string):Promise<string[]>;
    isInWatchlist(userId:string,auctionId:string):Promise<boolean>;
}