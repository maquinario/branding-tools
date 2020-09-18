import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/LogControllerDecoratorFactory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/LoadSurveys/LoadSurveysController'
import { makeDbLoadSurveys } from '../../../usecases/survey/loadSurveys/DbLoadSurveys'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
