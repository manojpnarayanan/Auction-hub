import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {config} from "../config/environment"
import container from "../../di/container"
import {TYPES} from "../../di/types"
import { GoogleAuthUseCase } from "../../application/use-cases/GoogleAuthUseCase";


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
                    const googleAuthUseCase=container.get<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase);
                    const result =await googleAuthUseCase.execute(googleData)
                    done(null,result);
                }catch (error){
                    done(error as Error , undefined);
                }
            }
        )
    );
    
}