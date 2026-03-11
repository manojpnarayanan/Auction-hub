import { injectable,inject } from "inversify";
import {TYPES} from '../../../di/types';
import bcrypt from 'bcrypt';
import { IChangePasswordUseCase } from "../Usecase Interfaces/profile-interface/IChangePasswordUseCase";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ConflictError, NotFoundError ,ValidationError} from "../../../domain/errors/errors";


@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase{
    constructor(
        @inject(TYPES.UserRepository)private _userRepository:IUserRepository
    ){}
    async execute(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError("User not found");
        const isMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isMatch) throw new ValidationError("Password is not matching");
        const hashed=await bcrypt.hash(newPassword,10);
        await this._userRepository.updatePassword(userId,hashed);
    }
}