import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";
HttpServer

export interface ISocketService{
    init(server:HttpServer):void,
    getIO():SocketIoServer,
    emit(event:string,data:any, room?:string):void;
}