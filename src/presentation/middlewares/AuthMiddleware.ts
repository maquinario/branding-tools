import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden } from '../helpers/Http/HttpHelper'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  async handle (httpRequesT: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new AccessDeniedError())
    return new Promise(resolve => resolve(error))
  }
}
