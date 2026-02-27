

export class Wallet{
    constructor(
        public readonly id:string,
        public readonly userId:string,
        public readonly balance:number,
        public readonly currency:string,
        public readonly createdAt:Date,
        public readonly updatedAt:Date,
    ){}
}