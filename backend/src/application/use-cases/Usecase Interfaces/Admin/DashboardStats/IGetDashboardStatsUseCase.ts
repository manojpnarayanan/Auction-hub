import { DashboardStatsDTO,DashboardPeriod } from "../../../../dtos/DashboardStatsDTO";


export interface IGetDashboardStatsUseCase{
    execute(period:DashboardPeriod):Promise<DashboardStatsDTO>
}