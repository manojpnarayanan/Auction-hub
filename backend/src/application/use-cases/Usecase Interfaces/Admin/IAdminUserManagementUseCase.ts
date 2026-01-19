

import { User } from "../../../../domain/entities/User.entity";

export interface IAdminUserManagementUseCase{
    execute(page:number,limit:number,search:string):Promise<{users:User[],total:number}>;
}