import { DashboardPeriod } from "../Types/DashboardTypes";

export function getDateConfig(period: DashboardPeriod) {
    const now = new Date();

    if (period === 'daily') {
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { from, format: '%Y-%m-%d' };
    } else if (period === 'monthly') {
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        return { from, format: '%Y-%m-%d' };
    } else {
        const from = new Date(now.getFullYear(), 0, 1);
        return { from, format: '%Y-%m' };
    }
}
