import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businesslogic/todoBusinessLogic'
const logger = createLogger('updateTodo')
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info('Updating todo', updatedTodo)
  updateTodo(updatedTodo, todoId);

  return {
    statusCode: 201,
    body: JSON.stringify({})
  }

})


handler.use(
  cors({
    credentials: true
  })
)