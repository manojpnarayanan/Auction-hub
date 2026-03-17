
import { injectable , inject } from "inversify";
import { UserResponseDTO } from "../../dtos/user.dto";
import { IGetprofileUseCase } from "../Usecase Interfaces/profile-interface/IGetprofileUseCase";
import {TYPES} from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError } from "../../../domain/errors/errors";
import { UserDTOMapper } from "../../DTOMapper/UserDTOMapper";

@injectable()
export class GetprofileUseCase implements IGetprofileUseCase{

    constructor(
        @inject(TYPES.UserRepository) private _userRepository:IUserRepository
    ){}
    async execute(userId: string): Promise<UserResponseDTO> {
        const user=await this._userRepository.findById(userId);
        if(!user) throw new NotFoundError("User Not Found");
        return UserDTOMapper.toResponseDTO(user);
    }
}