import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {config} from "../config/environment"
import container from "../../di/container"
import { IAuthService } from "../../domain/interfaces/IAuthService";
import {TYPES} from "../../di/types"

export const configurePassport=()=>{
    passport.use(
        new GoogleStrategy(
            {
                clientID:config.google.clientId,
                clientSecret:config.google.clientSecret,
                callbackURL:config.google.callbackUrl,
                scope:["profile","email"]
            },
            async (accessToken ,refreshToken, profile,done)=>{
                try{
                    const googleData={
                        googleId:profile.id,
                        email:profile.emails?.[0].value || "",
                        name:profile.displayName,
                        picture:profile.photos?.[0]?.value
                    };
                    const authService=container.get<IAuthService>(TYPES.AuthService)
                    const result =await authService.googleAuth(googleData);
                    done(null,result);
                }catch (error){
                    done(error as Error , undefined);
                }
            }
        )
    );
    
}