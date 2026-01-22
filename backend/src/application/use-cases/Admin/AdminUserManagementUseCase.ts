import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/User.entity";
import { IAdminUserManagementUseCase } from "../Usecase Interfaces/Admin/IAdminUserManagementUseCase";
import { UserDTOMapper } from "../../DTOMapper/UserDTOMapper";
import { UserResponseDTO } from "../../dtos/user.dto";


@injectable()

export class AdminUserManagementUseCase implements IAdminUserManagementUseCase{
    constructor(
        @inject(TYPES.UserRepository) private userRepository:IUserRepository 
    ) { }
    async execute(page: number, limit: number, search: string): Promise<{ users: UserResponseDTO[]; total: number; }> {
        const {users,total}=await this.userRepository.adminUserManage(page,limit,search);
        return {
            users:users.map(user=>UserDTOMapper.toResponseDTO(user)),total
        }
    }
}