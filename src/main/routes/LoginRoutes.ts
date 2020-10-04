import { Router } from 'express'
import { makeSignUpController } from '@/main/factories/controllers/auth/signUp/SignUpControllerFactory'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeLoginController } from '@/main/factories/controllers/auth/login/LoginControllerFactory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
