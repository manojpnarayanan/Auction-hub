import { UserResponseDTO } from "../../../dtos/user.dto";


export interface IGetprofileUseCase{
    execute(userId:string):Promise<UserResponseDTO>
}