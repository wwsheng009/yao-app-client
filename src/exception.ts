/**
 * Exception
 */
export class Exception extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(`Exception|${code},message:${message}`);
    this.name = "Exception";
    this.message = message;
    this.code = code;
  }
}
