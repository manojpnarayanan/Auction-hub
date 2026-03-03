

export interface IDeleteSubscriptionPlanUseCase{
    execute(id:string):Promise<boolean>
}