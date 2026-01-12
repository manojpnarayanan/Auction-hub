import { GoogleAuthDTO, OAuthResponseDTO } from "../../dtos/user.dto";


export interface IGoogleAuthUseCase{
    execute(googleData:GoogleAuthDTO):Promise<OAuthResponseDTO>
}