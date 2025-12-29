import "reflect-metadata";
import { Container } from "inversify";
import {TYPES} from "./types"
import { IAuthService } from "../domain/interfaces/IAuthService";
import { AuthService } from "../services/authService";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { MongoUserRepository } from "../infrastructure/database/repositories/MongoUserRepository";
import { AuthController } from "../controller/authController";

const container=new Container();

// Bind interface to Implementations

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController)


export default container;