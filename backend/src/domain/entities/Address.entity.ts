export type AddressLabel="Home" |"Work" | "Other"

export class Address{
    constructor(
        public readonly id:string,
        public readonly userId:string,
        public readonly label:AddressLabel,
        public readonly street:string,
        public readonly city:string,
        public readonly state:string,
        public readonly pincode:string,
        public readonly isDefault:boolean,
        public readonly createdAt:Date,
        public readonly updatedAt:Date,
    ){}
}