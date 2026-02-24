import API from "../axiosInstances";
import type { AxiosResponse } from "axios";
import type { CreateAddressDTO,UpdateAddressDTO, AddressResponseDTO } from "../../types/User-Address"; 



export const getAddress=():Promise<AxiosResponse<AddressResponseDTO[]>>=>{
    return API.get('/user/address')
}

export const addAddress=(data:CreateAddressDTO):Promise<AxiosResponse<AddressResponseDTO>>=>{
    return API.post('/user/address',data);
}

export const updateAddress=(id:string,data:UpdateAddressDTO):Promise<AxiosResponse<AddressResponseDTO>>=>{
    return API.put(`/user/address/${id}`,data);
}

export const deleteAddress=(id:string):Promise<AxiosResponse<void>>=>{
    return API.delete(`/user/address/${id}`);
}

export const setDefaultAddress=(id:string):Promise<AxiosResponse<void>>=>{
    return API.patch(`/user/address/${id}/default`)
}