import { DashboardPeriod } from "../Types/DashboardTypes";

export function getDateConfig(period: DashboardPeriod) {
    const now = new Date();

    if (period === 'daily') {
        // ONLY TODAY: Starts from midnight of the current day
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { from, format: '%Y-%m-%d' };
        
    } else if (period === 'monthly') {
        // LAST 30 DAYS: Goes back exactly 30 days from today
        const from = new Date(now);
        from.setDate(now.getDate() - 30);
        return { from, format: '%Y-%m-%d' };
        
    } else {
        // LAST 12 MONTHS: Goes back 11 months and jumps to the 1st of that month
        const from = new Date(now);
        from.setMonth(now.getMonth() - 11);
        from.setDate(1); 
        return { from, format: '%Y-%m' };
    }
}

export function getCustomDateConfig(startDate: string, endDate: string) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999); // include the full end day
    return { from, to, format: '%Y-%m-%d' };
}
