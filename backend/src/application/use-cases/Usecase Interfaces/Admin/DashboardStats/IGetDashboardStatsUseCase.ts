import { DashboardStatsDTO, DashboardPeriod } from "../../../../dtos/DashboardStatsDTO";


export interface IGetDashboardStatsUseCase {
    execute(period: DashboardPeriod, startDate?: string, endDate?: string): Promise<DashboardStatsDTO>;
}