import { io } from "socket.io-client";

const SOCKET_URL = window.location.hostname ==='localhost' ? 'http://localhost:3000':'https://api.auction-hub.online';
export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false
});