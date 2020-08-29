import request from 'supertest'
import app from '../config/App'
import faker from 'faker'
import { MongoHelper } from '../../infra/db/mongodb/helpers/MongoHelper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/Env'

let surveyCollection: Collection
let accountCollection: Collection

const accountData = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 if valid token is provided', async () => {
      const { name, email, password } = accountData
      const res = await accountCollection.insertOne({ name, email, password, role: 'admin' })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      console.log(accessToken)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })
})
