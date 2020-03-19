import 'source-map-support/register'
import { cors } from 'middy/middlewares' 
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda' 
import * as middy from 'middy'
import { deleteTodo } from '../../businesslogic/todoBusinessLogic'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')
 

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  const todoId = event.pathParameters.todoId
  logger.info("Deleting Todo", event.pathParameters.todoId) 
  
  deleteTodo(todoId)
   
  return {
    statusCode: 201,
    body: JSON.stringify({
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
