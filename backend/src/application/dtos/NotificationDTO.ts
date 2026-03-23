

export interface CreateNotificationDTO{
    userId:string;
    title:string;
    message:string;
    type:'info' | 'success' | 'warning' | 'error';
    link?:string;
    isAdmin?:boolean;
}

export interface NotificationResponseDTO{
    id:string;
    title:string;
    message:string;
    type:'info' | 'success' | 'warning' | 'error';
    isRead:boolean;
    createdAt:Date;
    link?:string;
}