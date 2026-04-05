export class ApiResponse<T>{
    public success:boolean;
    public message:string;
    public data:T|null;

    constructor(success:boolean,message:string,data:T|null){
        this.success=success;
        this.message=message;
        this.data=data;
    }
    static success<T>(data:T,message:string="Success"):ApiResponse<T>{
        return new ApiResponse<T>(true,message,data);
    }
    static ok(message:string):ApiResponse<null>{
        return new ApiResponse<null>(true,message,null);
    }
    static paginated<T>(data:T[],total:number,page:number,limit:number,message:string){
        return {
            success:true,
            message,
            data,
            total,
            page,
            totalPages:Math.ceil(total/limit)
        }
    }
    static error<T>(message:string ):ApiResponse<T>{
        return new ApiResponse<T>(false,message,null)
    }
}