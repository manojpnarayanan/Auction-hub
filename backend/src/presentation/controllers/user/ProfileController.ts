import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetprofileUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IGetprofileUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { IUpdateProfileUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IUpdateProfileUseCase";
import { IChangePasswordUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IChangePasswordUseCase";




@injectable()
export class profileController {
    constructor(
        @inject(TYPES.GetProfileUseCase) private _getProfileUseCase: IGetprofileUseCase,
        @inject(TYPES.updateProfileUseCase) private _updateProfileUseCase: IUpdateProfileUseCase,
        @inject(TYPES.changePasswordUseCase) private _changePassword: IChangePasswordUseCase
    ) { }
    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            // logger.info("Get profilr",userId);
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json({message:"UnAuthirized"});
            const profile = await this._getProfileUseCase.execute(userId);
            res.status(HttpStatus.OK).json(profile);
        } catch (error) {
            next(error);
        }
    }
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json({message:"UnAuthirized"});
            const updated =await this._updateProfileUseCase.execute(userId, req.body);
            res.status(HttpStatus.OK).json(updated);
        } catch (error) {
            next(error);
        }
    }
    changeProfilePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId=req.user?.id;
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json({message:"Unauthorized"});
            await this._changePassword.execute(userId, oldPassword, newPassword);
            res.status(HttpStatus.OK).json({ message: "Password changed successfully" });
        } catch (error) {
            next(error);
        }
    }
}