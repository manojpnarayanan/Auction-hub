export type AddressLabel="Home"| "Work"| "Other";


export interface AddressResponseDTO{
    id:string;
    userId:string;
    label:string;
    street:string;
    city:string;
    state:string;
    pincode:string;
    isDefault:boolean;
    createdAt:string;
}

export interface CreateAddressDTO{
    label:AddressLabel;
    street:string;
    city:string;
    state:string;
    pincode:string;
}

export interface UpdateAddressDTO{
    label?:AddressLabel;
    street?:string;
    city?:string;
    state?:string;
    pincode?:string;
}