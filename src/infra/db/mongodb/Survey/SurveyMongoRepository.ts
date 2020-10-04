import { AddSurveyRepository } from '@/data/protocols/db/Survey/AddSurveyRepository'
import { LoadSurveysRepository } from '@/data/protocols/db/Survey/LoadSurveysRepository'
import { SurveyModel } from '@/domain/models/Survey'
import { AddSurveyModel } from '@/domain/usecases/AddSurvey'
import { MongoHelper } from '../helpers/MongoHelper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys
  }
}
