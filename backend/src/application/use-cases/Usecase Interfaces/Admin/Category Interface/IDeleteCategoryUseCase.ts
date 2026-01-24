export interface IDeleteCategoryUseCase{
    execute(id:string):Promise<boolean>
}