import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/SignUp/SignUpControllerFactory'
import { adaptRoute } from '../adapters/Express/ExpressRouteAdapter'
import { makeLoginController } from '../factories/controllers/Login/LoginControllerFactory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
