import nodemailer from 'nodemailer';
import { injectable } from 'inversify';
import { config } from '../config/environment';

@injectable()

export class EmailService{
    private transporter;
    constructor(){
        this.transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });
    }
    async sendOTP(email:string,otp:string):Promise<void>{
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'Your Verification OTP',
            text:`Your otp for Auction Hub is:${otp}, It expires in 1 minute`
        };
        await this.transporter.sendMail(mailOptions)
    }
}