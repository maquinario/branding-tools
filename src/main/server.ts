import { MongoHelper } from '../infra/db/mongodb/helpers/MongoHelper'
import env from './config/Env'

const { port, host } = env

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/App')).default
    app.listen(Number(port), host, () => {
      console.log(`⚙ Server running at http://localhost:${env.port}!`)
    })
  })
  .catch(console.error)
