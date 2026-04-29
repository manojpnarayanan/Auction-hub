import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 
import type { Notification as AppNotification } from '../../types/notification'; 
import { getNotification,markNotificationRead } from '../../api/User/notification';


interface NotificationState {
    notifications: AppNotification[]; 
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
    const data = await getNotification();
    return data;
});

export const markAsReadThunk = createAsyncThunk('notifications/markAsRead', async (id: string) => {
    await markNotificationRead(id);
    return id;
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addRealtimeNotification: (state, action: PayloadAction<AppNotification>) => {
            state.notifications.unshift(action.payload); 
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n: AppNotification) => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed';
            })
            .addCase(markAsReadThunk.fulfilled, (state, action) => {
                const notification = state.notifications.find((n: AppNotification) => n.id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    }
});

export const { addRealtimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
