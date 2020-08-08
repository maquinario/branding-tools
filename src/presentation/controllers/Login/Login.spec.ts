import faker from 'faker'
import { LoginController } from './Login'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/Http/HttpHelper'
import { MissingParamError } from '../../errors'
import { HttpRequest, Authentication, Validation } from './LoginProtocols'
import { AuthenticationModel } from '../../../domain/usecases/Authentication'

const makeRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const fakeToken = faker.random.alphaNumeric(45)
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve(fakeToken))
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })

  test('Should return 401 if credentials are invalid', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if credentials are valid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: fakeToken }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeRequest()
    await sut.handle(request)
    delete request.body.passwordConfirmation
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
