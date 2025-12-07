// Unified API response utilities with TypeScript types

interface SuccessResponse<T = unknown> {
    success: true;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

interface ErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors: unknown;
    timestamp: string;
}

export function createSuccessResponse<T = unknown>(
    data: T,
    message: string = "Success",
    statusCode: number = 200
): Response {
    const responseBody: SuccessResponse<T> = {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseBody), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}

export function createErrorResponse(
    message: string = "Error",
    statusCode: number = 500,
    errors: unknown = null
): Response {
    const responseBody: ErrorResponse = {
        success: false,
        statusCode,
        message,
        errors,
        timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseBody), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}
