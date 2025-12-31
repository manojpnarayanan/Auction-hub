import "reflect-metadata";
import { Container } from "inversify";
import {TYPES} from "./types"
// Repositories
import { MongoUserRepository } from "../infrastructure/database/repositories/MongoUserRepository";
import { IUserRepository } from "../domain/interfaces/IUserRepository";

// UseCases
import { SignupUseCase } from "../application/use-cases/SignupUseCase";
 
import { LoginUseCase } from "../application/use-cases/LoginUseCase";
import { GoogleAuthUseCase } from "../application/use-cases/GoogleAuthUseCase";
  
import { AuthController } from "../presentation/controllers/Authcontroller";

const container=new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);

// useCases
container.bind<SignupUseCase>(TYPES.SignupUseCase).to(SignupUseCase);
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase)

// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController)


export default container;