export class ApiResponse<T>{
    public success:boolean;
    public message:string;
    public data:T|null;
    public statusCode:number;

    constructor(success:boolean,message:string,data:T|null,statusCode:number){
        this.success=success;
        this.message=message;
        this.data=data;
        this.statusCode=statusCode;
    }
    static success<T>(data:T,message:string="Success",statusCode:number=200):ApiResponse<T>{
        return new ApiResponse<T>(true,message,data,statusCode);
    }
    static error<T>(message:string,statusCode:number=500,data:T | null=null):ApiResponse<T>{
        return new ApiResponse<T>(false,message,data,statusCode)
    }
}