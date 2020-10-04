import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/LogControllerDecoratorFactory'
import { AddSurveyController } from '@/presentation/controllers/survey/AddSurvey/AddSurveyController'
import { makeAddSurveyValidation } from './AddSurveyValidationFactory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/addSurvey/DbAddSurveyFactory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
