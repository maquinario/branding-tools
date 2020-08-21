import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/Log/LogMongoRepository'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
