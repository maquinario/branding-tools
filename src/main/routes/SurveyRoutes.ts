import { Router } from 'express'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/AddSurveyControllerFactory'
import { makeLoadSurveysController } from '../factories/controllers/survey/loadSurveys/LoadSurveyControllerFactory'
import { adminAuth } from '../middlewares/AdminAuth'
import { auth } from '../middlewares/Auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
