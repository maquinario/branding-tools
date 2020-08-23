import { AddSurveyRepository } from '../../../../data/protocols/db/Survey/AddSurveyRepository'
import { AddSurveyModel } from '../../../../domain/usecases/AddSurvey'
import { MongoHelper } from '../helpers/MongoHelper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
