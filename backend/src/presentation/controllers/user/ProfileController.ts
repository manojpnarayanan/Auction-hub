import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetprofileUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IGetprofileUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { IUpdateProfileUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IUpdateProfileUseCase";
import { IChangePasswordUseCase } from "../../../application/use-cases/Usecase Interfaces/profile-interface/IChangePasswordUseCase";
import { ApiResponse } from "../../Common/APIResponse";
import { CustomMessages } from "../../Enums/CustomMessages";


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
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED));
            const profile = await this._getProfileUseCase.execute(userId);
            res.status(HttpStatus.OK).json(ApiResponse.success(profile, CustomMessages.PROFILE_FETCHED));
        } catch (error) {
            next(error);
        }
    }
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED));
            const updated =await this._updateProfileUseCase.execute(userId, req.body);
            res.status(HttpStatus.OK).json(ApiResponse.success(updated, CustomMessages.PROFILE_UPDATED));
        } catch (error) {
            next(error);
        }
    }
    changeProfilePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId=req.user?.id;
            if(!userId) return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED));
            await this._changePassword.execute(userId, oldPassword, newPassword);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.PASSWORD_CHANGED));
        } catch (error) {
            next(error);
        }
    }
}