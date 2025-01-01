class ErrorHandler extends Error {
    public readonly statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, new.target.prototype);
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export {ErrorHandler} ;