import { updateUserProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";


export interface IUpdateProfileUseCase{
    execute(userId:string,data:updateUserProfileDTO):Promise<UserResponseDTO>;
}