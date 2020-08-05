import faker from 'faker'
import { LogControllerDecorator } from './Log'
import { HttpRequest, HttpResponse, Controller } from '../../presentation/protocols'
import { serverError, ok } from '../../presentation/helpers/HttpHelper'
import { LogErrorRepository } from '../../data/protocols/LogErrorRepository'
import { AccountModel } from '../../domain/models/Account'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const account = {
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password()
}

const genericErrorStack = faker.random.words(3)

const makeFakeRequest = (): HttpRequest => {
  const request = {
    body: {
      ...account,
      passwordConfirmation: account.password
    }
  }
  delete request.body.id
  return request
}

const makeFakeAccount = (): AccountModel => {
  const { body } = makeFakeRequest()
  delete body.passwordConfirmation
  const accountData = Object.assign({ ...body }, { id: account.id })
  return accountData
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = genericErrorStack
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
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
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result as controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a ServerError ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(makeFakeServerError()))
    )
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith(genericErrorStack)
  })
})
