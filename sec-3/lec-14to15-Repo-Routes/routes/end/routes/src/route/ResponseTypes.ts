import { Type } from "@sinclair/typebox";

export const Status404 = {
  statusCode: 404,
  error: "Not Found",
  message: "Record not found",
};

export const Status500 = {
  statusCode: 500,
  error: "Internal Server Error",
  message: "An internal server error has occurred",
};

export const ErrorCodeType = Type.Object({
  statusCode: Type.Integer(),
  error: Type.String(),
  message: Type.String(),
});
