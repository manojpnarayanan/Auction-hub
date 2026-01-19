
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
        public readonly googleId?: string,
        public readonly isVerified: boolean = false,
        public readonly isBlocked:boolean= false,
    ) { }

    
    isOTPValid(providedOTP: string): boolean {
        if (!this.otp || !this.otpExpiry) {
            return false;
        }
        const isNotExpired = new Date() < this.otpExpiry;
        const isMatch = this.otp === providedOTP;
        return isNotExpired && isMatch;
    }
    isAdmin(): boolean {
        return this.role === 'admin';
    }
    isGoogleUser(): boolean {
        return !!this.googleId
    }
}
