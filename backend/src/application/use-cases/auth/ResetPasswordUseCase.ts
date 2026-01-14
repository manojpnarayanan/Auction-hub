import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IResetPasswordUseCase } from "../Usecase Interfaces/IResetPasswordUseCase";
import { NotFoundError, ValidationError } from "../../../domain/errors/errors";
import bcrypt from "bcrypt";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) { }

    async execute(email: string, otp: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        if (user.otp !== otp) throw new ValidationError("OTP Invalid");

        if (new Date() > new Date(user.otpExpiry!)) {
            throw new ValidationError("OTP Expired");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepository.updatePassword(user.id, hashedPassword);
        await this.userRepository.updateOTP(user.id, null, null);
    }
}