

export interface ISetDefaultUseCase{
    execute(userId:string,addressId:string):Promise<void>
}