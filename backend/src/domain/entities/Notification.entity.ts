export type NotificationType = 'info' | 'success' | 'warning' | 'error';


export class Notification {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly title: string,
        public readonly message: string,
        public readonly type: NotificationType,
        public readonly isRead: boolean,
        public readonly createdAt: Date,
        public readonly link?: string,
        public readonly isAdmin:boolean=false
    ) { }
}