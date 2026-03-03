export interface IcreateSubscriptionCheckoutUseCase{
    execute(userId:string,planId:string,planName:string):Promise<string>;
}