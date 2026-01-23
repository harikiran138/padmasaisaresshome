import { NextResponse } from "next/server";

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
};

export function successResponse<T>(data: T, status = 200, headers?: HeadersInit) {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status, headers });
}

export function errorResponse(
  message: string,
  code = "INTERNAL_ERROR",
  status = 500,
  details?: any
) {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}
