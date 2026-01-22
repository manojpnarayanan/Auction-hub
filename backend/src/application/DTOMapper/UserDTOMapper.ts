import { User } from "../../domain/entities/User.entity";
import { UserResponseDTO } from "../dtos/user.dto";


export class UserDTOMapper {
    static toResponseDTO(user:User):UserResponseDTO {
        return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            createdAt:user.createdAt
        }
    }
}