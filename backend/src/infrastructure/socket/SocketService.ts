import { injectable } from "inversify";
import logger from "../Global/Logger";
import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import { ISocketService } from "../../domain/interfaces/ISocketService";


@injectable()

export class SocketService implements ISocketService{
    private _io:SocketIoServer | null=null;
    init(httpServer:HttpServer):void{
        this._io=new SocketIoServer(httpServer,{
            cors:{
                origin:process.env.CORS_ORIGIN,
                methods:["GET","POST"],
                credentials:true
            }
        });
        this._io.on('connection',(socket)=>{
            logger.info(`Socket connected: ${socket.id}`);
            socket.on('join_auction',(auctionId)=>{
                socket.join(auctionId);
                logger.info(`Socket ${socket.id} joined room ${auctionId}`);
                // count viewers count
                const room=this._io!.sockets.adapter.rooms.get(auctionId);
                const viewerCount=room ? room.size :1;
                this._io!.to(auctionId).emit('viewer_count',{
                    auctionId,count:viewerCount
                });
            });
            socket.on('disconnecting',()=>{
                socket.rooms.forEach((room)=>{
                    if(room !== socket.id){
                        const roomSockets=this._io!.sockets.adapter.rooms.get(room);
                        const count=roomSockets ? roomSockets.size-1 :0;
                        this._io!.to(room).emit('viewer_count',{auctionId:room,count})
                    }
                });
            });
            socket.on('disconnect',()=>{
                logger.info(`Socket Disconnected: ${socket.id}`);
            })
        })
    }
    getIO():SocketIoServer{
        if(!this._io) throw new Error("Socket.io not initialized");
        return this._io;
    }
    emit(event:string,data:unknown,room?:string):void{
        if(!this._io) return;
        if(room){
            this._io.to(room).emit(event,data);
        }else{
            this._io.emit(event,data);
        }
    }
}