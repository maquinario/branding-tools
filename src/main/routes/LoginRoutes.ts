import { Router } from 'express'
import { makeSignUpController } from '../factories/SignUp/SignUpFactory'
import { adaptRoute } from '../adapters/Express/ExpressRouteAdapter'
import { makeLoginController } from '../factories/Login/LoginFactory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
