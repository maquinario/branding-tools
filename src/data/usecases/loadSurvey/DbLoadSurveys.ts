import { SurveyModel } from '../../../domain/models/Survey'
import { LoadSurveys } from '../../../domain/usecases/LoadSurvey'
import { LoadSurveysRepository } from '../../protocols/db/Survey/LoadSurveysRepository'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return null
  }
}
