import faker from 'faker'
import { LogControllerDecorator } from './Log'
import { HttpRequest, HttpResponse, Controller } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/HttpHelper'
import { LogErrorRepository } from '../../data/protocols/LogErrorRepository'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const password = faker.internet.password()
const account = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password,
  confirmpassword: password
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: account
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): any => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  test('Should call Controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: account
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result as controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: account
    }
    const expectedResponse = Object.assign({}, httpRequest, { statusCode: 200 })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(expectedResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a ServerError ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = faker.random.words(3)
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    )
    const httpRequest = {
      body: account
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
