import { Router } from 'express'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/AddSurveyControllerFactory'
import { makeAuthMiddleware } from '../factories/middlewares/AuthMiddlewareFactory'
import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/loadSurveys/LoadSurveyControllerFactory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
