
import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IEmailService } from "../../../domain/interfaces/IEmailService";
import { IResendOtpUseCase } from "../Usecase Interfaces/IResendOtpUseCase";
import { NotFoundError } from "../../../domain/errors/errors";

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase{
    constructor(
        @inject(TYPES.UserRepository) private userRepository:IUserRepository,
        @inject (TYPES.EmailService) private emailService:IEmailService,
    ) {}

    async execute(email:string):Promise<void>{
        const user=await this.userRepository.findByEmail(email);
        if(!user) throw new NotFoundError("User not Found");
        const otp=Math.floor(100000+Math.random()*900000).toString();
        const expiry=new Date(Date.now()+60*1000);
        await this.userRepository.updateOTP(user.id,otp,expiry);
        await this.emailService.sendOTP(user.email,otp);
    }
}