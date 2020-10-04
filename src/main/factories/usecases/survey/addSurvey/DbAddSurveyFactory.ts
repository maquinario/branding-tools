import { SurveyMongoRepository } from '@/infra/db/mongodb/Survey/SurveyMongoRepository'
import { DbAddSurvey } from '@/data/usecases/addSurvey/DbAddSurvey'
import { AddSurvey } from '@/domain/usecases/AddSurvey'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
