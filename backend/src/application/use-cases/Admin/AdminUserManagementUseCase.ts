import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/User.entity";
import { IAdminUserManagementUseCase } from "../Usecase Interfaces/Admin/IAdminUserManagementUseCase";


@injectable()

export class AdminUserManagementUseCase implements IAdminUserManagementUseCase{
    constructor(
        @inject(TYPES.UserRepository) private userRepository:IUserRepository 
    ) { }
    async execute(page: number, limit: number, search: string): Promise<{ users: User[]; total: number; }> {
        return this.userRepository.adminUserManage(page,limit,search);
    }
}