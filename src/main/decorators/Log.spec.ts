import faker from 'faker'
import { LogControllerDecorator } from './Log'
import { HttpRequest, HttpResponse, Controller } from '../../presentation/protocols'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
}

const password = faker.internet.password()
const account = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password,
  confirmpassword: password
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
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
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
})
