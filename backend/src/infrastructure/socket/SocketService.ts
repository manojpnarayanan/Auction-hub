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
            })
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