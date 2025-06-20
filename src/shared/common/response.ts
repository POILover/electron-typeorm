type ApiSuccessResponse<T> = {
  success: true
  data: T
  error?: never
}

type ApiErrorResponse = {
  success: false
  data?: never
  error: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export class ApiResponseFactory {
  static ok<T>(data: T): ApiSuccessResponse<T> {
    return {
      success: true,
      data
    }
  }

  static fail(error: string): ApiErrorResponse {
    return {
      success: false,
      error
    }
  }
}
