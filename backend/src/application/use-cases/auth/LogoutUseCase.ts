import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { ICacheService } from "../../../domain/interfaces/ICacheService";
import { ILogoutUseCase } from "../Usecase Interfaces/ILogoutUseCase";
import jwt from "jsonwebtoken";
import { config } from "../../../infrastructure/config/environment";


@injectable()
export class LogoutUseCase implements ILogoutUseCase{
    constructor(
        @inject(TYPES.CacheService) private cacheService:ICacheService
    ){}
    async execute(token:string):Promise<void>{
        const decoded=jwt.verify(token,config.jwtSecret) as any;
        await this.cacheService.delete(`refresh_Token:${decoded.id}`);
    }
}