import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { IAuthService } from "../domain/interfaces/IAuthService";
import { CreateUserDTO, LoginDTO, UserResponseDTO, LoginResponseDTO,GoogleAuthDTO, OAuthResponseDTO } from "../application/dtos/user.dto";
import { ConflictError, UnauthorizedError } from "../domain/errors/errors";
import { config } from "../infrastructure/config/environment";
import {injectable,inject} from "inversify";
import {TYPES} from "../di/types";

/**
 * Authentication Service
 * Implements business logic for user authentication
 * Following Dependency Inversion Principle - depends on abstractions (IUserRepository)
 */
@injectable()

export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) { }

    /**
     * Register a new user
     * @param data - User registration data
     * @returns User response DTO (without password)
     * @throws ConflictError if user already exists
     */
    async signup(data: CreateUserDTO): Promise<UserResponseDTO> {
        // Check if user already exists
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new ConflictError("User already exists");
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword
        });

        // Return DTO without sensitive data
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
    }

    /**
     * Authenticate user and generate JWT token
     * @param data - Login credentials
     * @returns Login response with token and user data
     * @throws UnauthorizedError if credentials are invalid
     */
    async login(data: LoginDTO): Promise<LoginResponseDTO> {
        // Find user by email
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiry } as any
        );

        // Return response with token and user data (without password)
        return {
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        };
    }
    async googleAuth(data: GoogleAuthDTO): Promise<OAuthResponseDTO> {
        let user=await this.userRepository.findByGoogleId(data.googleId);
        let isNewUser=false;
        if(!user){
            user=await this.userRepository.findByEmail(data.email);
            if(user){
                throw new ConflictError("Email already registered.Please login with password")
            }else{
                const newUser=await this.userRepository.create({
                    name:data.name,
                    email:data.email,
                    password:"",
                    googleId:data.googleId
                }as any);
                user=newUser;
                isNewUser=true;
            }
        }
        const token=jwt.sign({
            id:user.id,
            role:user.role
        },config.jwtSecret,
        {expiresIn:config.jwtExpiry} as any
    );
    return {
        message:isNewUser? "Account created successfully " :"Login successfull",
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            createdAt:user.createdAt
        },
        isNewUser
    }
    }
}