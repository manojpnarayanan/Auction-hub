export type DashboardPeriod='daily'|'monthly'|'yearly';

export interface DashboardStatsDTO{
    totalRevenue:number;
    auctionSuccessRate:number;
    inventory:{
        pending:number;
        approved:number;
        active:number;
    };
    totalUsers:number;
    revenueTimeline:{label:string;amount:number}[];
    userGrowthTimeline:{label:string;count:number}[];
}