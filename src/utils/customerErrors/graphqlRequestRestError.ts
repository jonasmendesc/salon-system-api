export class GraphqlRequestRestError extends Error {
  code: number;

  constructor(inputError: { code: number; messageError: string }) {
    super();
    this.code = inputError.code;
    this.message = inputError.messageError;
  }
}
