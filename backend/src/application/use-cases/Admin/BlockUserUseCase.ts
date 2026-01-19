import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IBlockUserUseCase } from "../Usecase Interfaces/Admin/IBlockUserUseCase";



@injectable()

export class BlockUserUseCase implements IBlockUserUseCase{
    constructor(
        @inject (TYPES.UserRepository) private userRepository:IUserRepository
    ) { };
    async execute(userId: string, isBlocked: boolean): Promise<void> {
        return await this.userRepository.updateBlockStatus(userId,isBlocked);
    }
}