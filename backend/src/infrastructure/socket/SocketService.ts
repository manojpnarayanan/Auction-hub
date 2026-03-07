import { injectable } from "inversify";
import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import { ISocketService } from "../../domain/interfaces/ISocketService";


@injectable()

export class SocketService implements ISocketService{
    private io:SocketIoServer | null=null;
    init(httpServer:HttpServer):void{
        this.io=new SocketIoServer(httpServer,{
            cors:{
                origin:"http://localhost:5173",
                methods:["GET","POST"],
                credentials:true
            }
        });
        this.io.on('connection',(socket)=>{
            console.log("Socket connected",socket.id);
            socket.on('join_auction',(auctionId)=>{
                socket.join(auctionId);
                console.log(`Socket ${socket.id} joined room ${auctionId}`);
                // count viewers count
                const room=this.io!.sockets.adapter.rooms.get(auctionId);
                const viewerCount=room ? room.size :1;
                this.io!.to(auctionId).emit('viewer_count',{
                    auctionId,count:viewerCount
                });
            });
            socket.on('disconnecting',()=>{
                socket.rooms.forEach((room)=>{
                    if(room !== socket.id){
                        const roomSockets=this.io!.sockets.adapter.rooms.get(room);
                        const count=roomSockets ? roomSockets.size-1 :0;
                        this.io!.to(room).emit('viewer_count',{auctionId:room,count})
                    }
                });
            });
            socket.on('disconnect',()=>{
                console.log('Socket Disconnected',socket.id);
            })
        })
    }
    getIO():SocketIoServer{
        if(!this.io) throw new Error("Socket.io not initialized");
        return this.io;
    }
    emit(event:string,data:any,room?:string):void{
        if(!this.io) return;
        if(room){
            this.io.to(room).emit(event,data);
        }else{
            this.io.emit(event,data);
        }
    }
}