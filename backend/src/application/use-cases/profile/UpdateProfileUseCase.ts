import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IUpdateProfileUseCase } from "../Usecase Interfaces/profile-interface/IUpdateProfileUseCase";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { updateUserProfileDTO, UserResponseDTO } from "../../dtos/user.dto";
import { UserDTOMapper } from "../../DTOMapper/UserDTOMapper";


@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        @inject(TYPES.UserRepository)private _userRepository:IUserRepository
    ){}
    async execute(userId: string, data: updateUserProfileDTO): Promise<UserResponseDTO> {
        const user=await this._userRepository.updateProfile(userId,data);
        return UserDTOMapper.toResponseDTO(user);
    }
}