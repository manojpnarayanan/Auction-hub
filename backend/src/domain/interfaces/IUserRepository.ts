import { User } from "../entities/User.entity";
import { CreateUserDTO } from "../../application/dtos/user.dto";

/**
 * Repository interface for User data access
 * Following the Repository Pattern and Dependency Inversion Principle
 */
export interface IUserRepository {
    /**
     * Create a new user
     */
    create(userData: CreateUserDTO): Promise<User>;

    /**
     * Find user by email address
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Find user by ID
     */
    findById(id: string): Promise<User | null>;

    /**
     * Update user's OTP and expiry
     */
    updateOTP(userId: string, otp: string, expiry: Date): Promise<void>;

    // for Google id using Auth
    findByGoogleId(googleId: string): Promise<User | null>;
}
