import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError, ValidationError } from "../../../domain/errors/errors";
import { IVerifyOtpUseCase } from "../Usecase Interfaces/IVerifyOtpUseCase";


@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository
    ) { }
    async execute(email: string, otp: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        // if (user.otp !== otp) throw new Error("OTP Invalid");
        // if (new Date() > new Date(user.otpExpiry!)) {
        //     throw new ValidationError("OTP Expired");
        // }
        if(!user.isOTPValid(otp)){
            throw new ValidationError('Invalid or Expired OTP')
        }
        await this._userRepository.updateVerifyStatus(user.id, true)
        await this._userRepository.updateOTP(user.id, null, null);
    }
}