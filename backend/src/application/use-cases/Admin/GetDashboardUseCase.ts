import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IGetDashboardStatsUseCase } from "../Usecase Interfaces/Admin/DashboardStats/IGetDashboardStatsUseCase";
import { DashboardStatsDTO ,DashboardPeriod } from "../../dtos/DashboardStatsDTO";


@injectable()
export class GetDashboardUseCase implements IGetDashboardStatsUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepo:IAuctionRepository,
        @inject(TYPES.WalletRepository) private _walletRepo:IWalletRepository,
        @inject(TYPES.UserRepository) private _userRepo:IUserRepository
    ){}
    async execute(period: DashboardPeriod): Promise<DashboardStatsDTO> {
        const [auctionStats, revenueData,userGrowthData]= await Promise.all([
            this._auctionRepo.getAuctionStats(),
            this._walletRepo.getTotalRevenue(period),
            this._userRepo.getUserGrowth(period),
            this._userRepo.getTotalUserCount(),
        ]);
        const totalClosed=auctionStats.sold + auctionStats.expired;
        const auctionSuccessRate=totalClosed >0 ? Math.round((auctionStats.sold/totalClosed)*100):0;
        const totalUsers=userGrowthData.timeline.reduce((sum,t)=>sum+t.count,0);

        return {
            totalRevenue:revenueData.total,
            auctionSuccessRate,
            inventory:{
                pending:auctionStats.pending,
                approved:auctionStats.approved,
                active:auctionStats.active
            },
            totalUsers,
            revenueTimeline:revenueData.timeline,
            userGrowthTimeline:userGrowthData.timeline,
        }
    }
}