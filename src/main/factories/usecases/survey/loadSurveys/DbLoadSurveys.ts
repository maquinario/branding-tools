import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/Survey/SurveyMongoRepository'
import { DbLoadSurveys } from '../../../../../data/usecases/loadSurvey/DbLoadSurveys'
import { LoadSurveys } from '../../../../../domain/usecases/LoadSurvey'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
