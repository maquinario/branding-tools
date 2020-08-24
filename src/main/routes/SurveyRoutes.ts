import { Router } from 'express'
import { adaptRoute } from '../adapters/Express/ExpressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/AddSurvey/AddSurveyControllerFactory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
