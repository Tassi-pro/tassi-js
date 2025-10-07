export class TassiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TassiError";
    Object.setPrototypeOf(this, TassiError.prototype);
  }
}

export class InvalidRequestError extends TassiError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRequestError";
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}

export class ApiConnectionError extends TassiError {
  httpStatus: number | null;
  httpRequest: any;
  httpResponse: any;

  constructor(
    message: string,
    httpStatus: number | null = null,
    httpRequest: any = null,
    httpResponse: any = null
  ) {
    super(message);
    this.name = "ApiConnectionError";
    this.httpStatus = httpStatus;
    this.httpRequest = httpRequest;
    this.httpResponse = httpResponse;
    Object.setPrototypeOf(this, ApiConnectionError.prototype);
  }
}

export class AuthenticationError extends TassiError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends TassiError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends TassiError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
