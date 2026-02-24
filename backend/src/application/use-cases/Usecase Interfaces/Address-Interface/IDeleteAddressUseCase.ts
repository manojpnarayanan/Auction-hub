


export interface IDeleteAddressUseCase{
    execute(addressId:string):Promise<void>;
}