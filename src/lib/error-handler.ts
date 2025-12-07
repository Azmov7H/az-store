// Global error handling utilities with TypeScript types
import { NextResponse } from "next/server";

interface MongooseValidationError extends Error {
    errors: Record<string, { message: string }>;
}

interface MongooseDuplicateError extends Error {
    code: number;
}

interface MongooseCastError extends Error {
    path: string;
    value: unknown;
}

class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.name = "AppError";
    }
}

export const createError = (message: string, statusCode: number): AppError => {
    return new AppError(message, statusCode);
};

export const handleError = (err: Error | AppError | MongooseValidationError | MongooseDuplicateError | MongooseCastError): NextResponse => {
    // DB Validation Errors
    if (err.name === "ValidationError") {
        const validationErr = err as MongooseValidationError;
        const message = Object.values(validationErr.errors)
            .map((val) => val.message)
            .join(", ");
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    // Duplicate key error
    if ("code" in err && err.code === 11000) {
        const message = "Duplicate field value entered";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    // Cast error (invalid ID format)
    if (err.name === "CastError") {
        const castErr = err as MongooseCastError;
        const message = `Invalid ${castErr.path}: ${castErr.value}`;
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    // Custom App Error
    if (err instanceof AppError && err.isOperational) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: err.statusCode }
        );
    }

    // Unknown Error - log only in development
    if (process.env.NODE_ENV === "development") {
        console.error("UNEXPECTED ERROR 💥:", err);
    }

    return NextResponse.json(
        { success: false, error: "Something went wrong" },
        { status: 500 }
    );
};

type ApiHandler = (req: Request, ...args: unknown[]) => Promise<Response | NextResponse>;

export const apiHandler = (handler: ApiHandler): ApiHandler => {
    return async (req: Request, ...args: unknown[]): Promise<Response | NextResponse> => {
        try {
            return await handler(req, ...args);
        } catch (err) {
            return handleError(err as Error);
        }
    };
};
