import { ok, serverError } from '../../../helpers/Http/HttpHelper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './LoadSurveysControllerProtocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
