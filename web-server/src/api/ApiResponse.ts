export type ApiError = {
  message: string;
  code: string;
};

export type ApiRootError = {
  errors: ApiError[];
  fieldErrors: {
    [key: string]: ApiError[];
  };
} & ApiError;

export type ApiResponse<T> = {
  result?: T;
  error?: ApiRootError;
};

export function response<T>(message: T): ApiResponse<T> {
  return {result: message};
}

class ApiResponseBuilder<T> {
  private error?: ApiRootError;
  private result?: T;
  er(er: {field?: string} & ApiError): ApiResponseBuilder<T> {
    if (this.error) {
      if (er.field) {
        const fieldErrors = this.error.fieldErrors[er.field];
        if (!fieldErrors) this.error.fieldErrors[er.field] = [];
        fieldErrors.push({
          message: er.message,
          code: er.code,
        });
      } else {
        this.error.errors.push(er);
      }
    } else {
      this.error = {
        message: er.message,
        code: er.code,
        errors: [],
        fieldErrors: {},
      };
      if (er.field) {
        this.error.fieldErrors[er.field] = [
          {
            message: er.message,
            code: er.code,
          },
        ];
      }
    }
    return this;
  }
  ok(ok: T): ApiResponseBuilder<T> {
    this.result = ok;
    return this;
  }
  build(ok?: T): ApiResponse<T> {
    if (ok) {
      this.ok(ok);
    }
    return {
      result: this.result,
      error: this.error,
    };
  }
}

export function useResponse<T>(): ApiResponseBuilder<T> {
  return new ApiResponseBuilder<T>();
}
