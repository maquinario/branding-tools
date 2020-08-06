import { Controller, HttpRequest, HttpResponse, EmailValidator } from '../../protocols'
import { badRequest } from '../../helpers/HttpHelper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(
        badRequest(new MissingParamError('email'))
      ))
    }
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(
        badRequest(new MissingParamError('password'))
      ))
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return new Promise(resolve => resolve(
        badRequest(new InvalidParamError('email'))
      ))
    }
  }
}
