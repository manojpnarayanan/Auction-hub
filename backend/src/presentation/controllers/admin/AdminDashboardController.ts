import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAdminUserManagementUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/IAdminUserManagementUseCase";
import { IBlockUserUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/IBlockUserUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { DashboardPeriod } from "../../../application/dtos/DashboardStatsDTO";
import { IGetDashboardStatsUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/DashboardStats/IGetDashboardStatsUseCase";


@injectable()
export class AdminController {
    constructor(
        @inject(TYPES.AdminUserManagementUseCase) private _adminUserManagementUseCase: IAdminUserManagementUseCase,
        @inject(TYPES.BlockUserUseCase) private _blockUserUseCase: IBlockUserUseCase,
        @inject(TYPES.GetDashboardUseCase) private _getDashboardUseCase: IGetDashboardStatsUseCase
    ) { };
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 3;
            // logger.info(req.query)
            const search = req.query.search as string || "";
            // const query:any={role:"user"};
            const result = await this._adminUserManagementUseCase.execute(page, limit, search);

            res.status(HttpStatus.OK).json({
                users: result.users,
                totalPages: Math.ceil(result.total / limit),
                currentPage: page,
                totalUsers: result.total
            });
        } catch (error) {
            next(error);
        }
    }
    async BlockUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { isBlocked } = req.body;

            await this._blockUserUseCase.execute(userId, isBlocked);
            res.status(HttpStatus.OK).json({ message: `User ${isBlocked ? "blocked" : "unblocked"} successfully` });
        } catch (error) {
            next(error);
        }
    }
    getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const period = (req.query.period as DashboardPeriod) ?? 'monthly';
            const startDate = req.query.startDate as string | undefined;
            const endDate   = req.query.endDate   as string | undefined;
            const stats = await this._getDashboardUseCase.execute(period, startDate, endDate);
            res.status(HttpStatus.OK).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }
}