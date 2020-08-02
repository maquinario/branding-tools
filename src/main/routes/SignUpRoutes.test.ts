import faker from 'faker'
import request from 'supertest'
import app from '../config/App'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    const password = faker.internet.password()
    await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password
      })
      .expect(200)
  })
})
