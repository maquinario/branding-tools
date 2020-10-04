import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/ExpressRouteAdapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/addSurvey/AddSurveyControllerFactory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/loadSurveys/LoadSurveyControllerFactory'
import { adminAuth } from '@/main/middlewares/AdminAuth'
import { auth } from '@/main/middlewares/Auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
