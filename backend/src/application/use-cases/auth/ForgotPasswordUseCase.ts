import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IEmailService } from "../../../domain/interfaces/IEmailService";
import { IForgotPasswordUseCase } from "../Usecase Interfaces/IForgotPasswordUseCase";
import { NotFoundError } from "../../../domain/errors/errors";


@injectable()

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");
        const otp = Math.floor(100000 + Math.random() * 9000000).toString();
        const expiry = new Date(Date.now() + 1 * 60 * 1000);
        await this._userRepository.updateOTP(user.id, otp, expiry);
        await this._emailService.sendOTP(user.email, otp);
    }
}