

export interface CreateAddressDTO{
    label:'Home'| 'Work' | 'Other';
    street:string;
    city:string;
    state:string;
    pincode:string;
}

export interface updateAddressDTO{
    label?:'Home'| 'Work' | 'Other';
    street?:string;
    city?:string;
    state?:string;
    pincode?:string;
}

export interface AddressResponseDTO{
    id:string;
    userId:string;
    label:string;
    street:string;
    city:string;
    state:string;
    pincode:string;
    isDefault:boolean;
    createdAt:Date;
}