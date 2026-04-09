import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRealtimeNotification, fetchNotifications, markAsReadThunk } from '../redux/slices/notificationSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { socket } from '../utils/socket';

export default function NotificationBell() {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchNotifications());
        if (!socket.connected) socket.connect();
        if (user?.role === 'admin') {
            socket.emit('join_admin');
            socket.on('admin_notification', (newNotification) => {
                dispatch(addRealtimeNotification(newNotification))
            })
        } else if (user?.id) {
            socket.emit("join_user", user.id);
            socket.on('notification', (newNotification) => {
                dispatch(addRealtimeNotification(newNotification))
            });
        }
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            socket.off('notification');
            socket.off('admin_notification');
            document.removeEventListener('mousedown', handleClickOutside)
        }
        
    }, [dispatch, user]);

    const handleMarkRead = (id: string, isRead: boolean) => {
        if (!isRead) {
            dispatch(markAsReadThunk(id))
        }
    }
    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-full transition relative"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Red Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#1da1f2]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications?.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                        ) : (
                            notifications?.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 border-b hover:bg-gray-50 transition cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-blue-50/20'}`}
                                    onClick={() => handleMarkRead(notif.id, notif.isRead)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm font-semibold ${notif.type === 'error' ? 'text-red-600' : notif.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                                            {notif.title}
                                        </span>
                                        {!notif.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></span>}
                                    </div>
                                    <p className="text-xs text-gray-600 leading-snug">{notif.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}