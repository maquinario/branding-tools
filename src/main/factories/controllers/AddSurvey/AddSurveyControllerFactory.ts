import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/LogControllerDecoratorFactory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/AddSurvey/AddSurveyController'
import { makeAddSurveyValidation } from './AddSurveyValidationFactory'
import { makeDbAddSurvey } from '../../usecases/addSurvey/DbAddSurveyFactory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
