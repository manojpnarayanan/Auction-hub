import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";

export interface ISocketService{
    init(server:HttpServer):void,
    getIO():SocketIoServer,
    emit(event:string,data:unknown, room?:string):void;
}