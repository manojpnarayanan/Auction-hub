/**
 * Domain Entity: User
 * Framework-agnostic representation of a User
 * Contains only business logic, no infrastructure concerns
 */
export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: 'user' | 'admin',
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly otp?: string,
        public readonly otpExpiry?: Date,
        public readonly googleId?:string,
        public readonly isVerified:boolean=false,
    ) { }

    /**
     * Check if OTP is valid and not expired
     */
    isOTPValid(providedOTP: string): boolean {
        if (!this.otp || !this.otpExpiry) {
            return false;
        }

        const isNotExpired = new Date() < this.otpExpiry;
        const isMatch = this.otp === providedOTP;

        return isNotExpired && isMatch;
    }

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.role === 'admin';
    }

     // Add helper method
    isGoogleUser():boolean{
        return !!this.googleId
    }
}
