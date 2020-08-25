import { forbidden } from '../helpers/Http/HttpHelper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './AuthMiddleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
