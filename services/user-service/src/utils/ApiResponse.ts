export class ApiResponse {
    public success: boolean;
    public message: string;
    public data: any | null;
    public statusCode: number;


    constructor(success: boolean, message: string, statusCode: number, data: any | null = null) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

    public successResponse(message: string = 'Request successful',statusCode:number,data : any):any {
        return new ApiResponse(true, message,statusCode, data);
    }

    public errorResponse(message: string,statusCode:number, data: any | null = null):any {
        return new ApiResponse(false, message,statusCode, data);
    }

}