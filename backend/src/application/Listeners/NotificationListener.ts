import { injectable,inject } from "inversify";
import { TYPES } from "../../di/types";
import EventEmitter from "events";
import { ICreateNotificationUseCase } from "../use-cases/Usecase Interfaces/Notification-Interface/ICreateNotificationUseCase";
import { AuctionApprovedEvent, AuctionEndedEvent, AuctionRejectedEvent,AuctionCreatedEvent } from "../../domain/events/AuctionEvents";
import { PaymentConfirmedEvent, PaymentReleaseEvent, SubscriptionActivateEvent } from "../../domain/events/PaymentEvents";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";


@injectable()
export class NotificationListener{
    constructor(
        @inject(TYPES.EventEmitter)private _eventEmitter:EventEmitter,
        @inject(TYPES.CreateNotificationUseCase) private _createNotificationUseCase:ICreateNotificationUseCase,
        @inject(TYPES.UserRepository) private _userRepository:IUserRepository
    ){
        this.init();
    }
    private init():void{
        this._eventEmitter.on('AuctionApprovedEvent',(e)=>this.handleAuctionApproved(e));
        this._eventEmitter.on('AuctionRejectedEvent',(e)=>this.handleAuctionRejected(e));
        this._eventEmitter.on('AuctionEndedEvent',(e)=>this.handleAuctionEnded(e));
        this._eventEmitter.on("PaymentConfirmedEvent",(e)=>this.handlePaymentConfirmed(e));
        this._eventEmitter.on("PaymentReleaseEvent",(e)=>this.handlePaymentRelease(e));
        this._eventEmitter.on("SubscriptionActivateEvent",(e)=>this.handleSubscriptionActivated(e));
        this._eventEmitter.on('AuctionCreatedEvent',(e)=>this.handleAuctionCreated(e));
    }
    private async handleAuctionApproved(event:AuctionApprovedEvent){
        await this._createNotificationUseCase.execute({
            userId:event.sellerId,
            title:"Auction Approved",
            message:`Your Auction for ${event.auctionId} has been approved`,
            type:'success',
            link:'/my-listings'
        })
    }
    private async handleAuctionRejected(event:AuctionRejectedEvent){
        await this._createNotificationUseCase.execute({
            userId:event.sellerId,
            title:"Auction Rejected",
            message:`Your Auction ${event.auctionId} was rejected, Reason:${event.reason}`,
            type:'error',
            link:'/user/my-listings'
        });
    }
    private async handleAuctionEnded(event:AuctionEndedEvent){
        if(event.status ==='sold' && event.winnerId){
            await this._createNotificationUseCase.execute({
                userId:event.winnerId,
                title:"You won an Auction",
                message:`You won auction ${event.auctionId}.Please proceed for payment`,
                type:"success",
                link:"/user/my-bids"
            });
        }
    }
    private async handlePaymentConfirmed(event:PaymentConfirmedEvent){
        const admin=await this._userRepository.findAdmin();
        if(!admin) return ;
        await this._createNotificationUseCase.execute({
            userId:admin.id,
            title:"Payment Received",
            message:`Payment of ${event.amount} received from user ${event.buyerId} for auction ${event.auctionId}`,
            type:"info",
            link:'/admin',
            isAdmin:true
        })
    }
    private async handlePaymentRelease(event:PaymentReleaseEvent){
        await this._createNotificationUseCase.execute({
            userId:event.sellerId,
            title:"Funds Released",
            message:`${event.amount} has been released to your wallet `,
            type:'success',
            link:'/user/wallet'
        })
        await this._createNotificationUseCase.execute({
            userId:event.buyerId,
            title:event.isAutomatic ? "Automatic Fund Release" :"Payment released",
            message:event.isAutomatic ? `The Funds for Auction have been automatically released after 3 days` :
            `You have confirmed delivery, and funds for auction were released to the seller`,
            type:"info",
            link:'user/my-bids'
        });
        const admin=await this._userRepository.findAdmin();
        if(admin){

            await this._createNotificationUseCase.execute({
                userId:admin.id,
                title:`Escrow funds released (${event.isAutomatic ? "Auto":"Manual"})`,
                message:`Auction ${event.auctionId} :${event.amount} released to seller`,
                type:'info',
                link:'/admin',
                isAdmin:true
            })
        }
    }
    private async handleSubscriptionActivated(event:SubscriptionActivateEvent){
        await this._createNotificationUseCase.execute({
            userId:event.userId,
            title:"Subscription Activated",
            message:`Your ${event.planName} plan is now active until ${event.endDate.toLocaleDateString()}`,
            type:"success",
            link:"/user/dashboard"
        })
    }
    private async handleAuctionCreated(event:AuctionCreatedEvent){
        const admin=await this._userRepository.findAdmin();
        if(!admin) return ;
        await this._createNotificationUseCase.execute({
            userId:admin.id,
            title:`New Auction pending Approval`,
            message:`User ${event.sellerId} submitted the auction`,
            type:"info",
            link:"/admin/auctions",
            isAdmin:true
        })
    }
}