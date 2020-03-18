import 'source-map-support/register'
import { cors } from 'middy/middlewares'
//import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as middy from 'middy'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

const todoTable = process.env.TODO_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info("Deleting Todo",event.pathParameters.todoId) 
  // TODO: Remove a TODO item by id 
  const result = await docClient.query({
    TableName : todoTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
        ':todoId': todoId
    }
}).promise()

if (result.Count == 0) {   
  logger.error("Unable to delete record. Todo ID not found") 
  throw new Error('Unable to delete record. Todo ID not found')
} 
  const createdAt = result.Items[0].createAt
  const params = {
    TableName:todoTable,
    Key:{
        'todoId': todoId,
        'createdAt': createdAt
    }
    
};

  await docClient.delete(params, function(err, data) {
      if (err) {
          logger.error("Unable to delete", err) 
          console.error("Unable to delete Todo. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          logger.info("Delete success", data) 
          console.log("Delete todo succeeded:", JSON.stringify(data, null, 2));
      }
  }).promise()
 
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
