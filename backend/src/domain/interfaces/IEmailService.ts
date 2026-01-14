
export interface IEmailService{
    sendOTP(to:string,otp:string):Promise<void>;
} 
