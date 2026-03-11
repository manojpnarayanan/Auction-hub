import { GoogleAuthDTO, OAuthResponseDTO } from "../../dtos/user.dto";


export interface IGoogleAuthUseCase{
    execute(googleData:{code:string}):Promise<OAuthResponseDTO>
}