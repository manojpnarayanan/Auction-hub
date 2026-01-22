

import { User } from "../../../../domain/entities/User.entity";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IAdminUserManagementUseCase{
    execute(page:number,limit:number,search:string):Promise<{users:UserResponseDTO[],total:number}>;
}