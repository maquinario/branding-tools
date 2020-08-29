import { Router } from 'express'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/AddSurveyControllerFactory'
import { makeAuthMiddleware } from '../factories/middlewares/AuthMiddlewareFactory'
import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
