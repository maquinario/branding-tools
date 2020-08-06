import faker from 'faker'
import { LoginController } from './Login'
import { badRequest } from '../../helpers/HttpHelper'
import { MissingParamError } from '../../errors'

const loginInfo = {
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Login controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: loginInfo.password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
