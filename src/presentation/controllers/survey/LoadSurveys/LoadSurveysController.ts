import { ok } from '../../../helpers/Http/HttpHelper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './LoadSurveysControllerProtocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
