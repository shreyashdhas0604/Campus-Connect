export class ApiResponse {
    constructor(
        public success: boolean,
        public message: string,
        public statusCode: number,
        public data: any
    ) {}
}