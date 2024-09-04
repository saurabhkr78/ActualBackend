class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data// it's allow to ssent data in api resposnse
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }