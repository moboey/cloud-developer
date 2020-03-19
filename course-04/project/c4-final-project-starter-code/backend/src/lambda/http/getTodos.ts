import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllGroups } from '../../businesslogic/todoBusinessLogic'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
const logger = createLogger('getTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Get TODOs', event)
  const userId = getUserId(event)

  const todos = await getAllGroups(userId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }

})

handler.use(
  cors({
    credentials: true
  })
)
