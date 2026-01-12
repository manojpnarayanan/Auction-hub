

export interface ILogoutUseCase{
    execute(token:string):Promise<void>
};