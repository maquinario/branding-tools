import { Router } from 'express'
import { makeSignUpController } from '../factories/SignUp/SignUpFactory'
import { adaptRoute } from '../adapters/Express/ExpressRouteAdapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
