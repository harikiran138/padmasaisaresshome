export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown) => {
    if (error instanceof AppError) {
        return {
            success: false,
            error: error.message,
            statusCode: error.statusCode,
        };
    }
    
    console.error("Unexpected Error:", error);
    return {
        success: false,
        error: "Internal Server Error",
        statusCode: 500,
    };
};
