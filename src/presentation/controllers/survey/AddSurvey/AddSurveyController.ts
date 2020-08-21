import { Controller, HttpRequest, HttpResponse } from './AddSurveyControllerProtocols'
import { Validation } from '../../../protocols'
import { badRequest } from '../../../helpers/Http/HttpHelper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return new Promise(resolve => resolve(null))
  }
}
