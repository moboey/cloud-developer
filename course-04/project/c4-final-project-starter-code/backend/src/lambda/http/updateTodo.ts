import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

const todoTable = process.env.TODO_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body) 
  logger.info('Updating todo', updatedTodo) 
  // TODO: Remove a TODO item by id 
  const result = await docClient.query({
    TableName : todoTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
        ':todoId': todoId
    }
}).promise()

const createdAt = result.Items[0].createdAt

if (result.Count == 0) {   
  logger.error("Unable to update record. Todo ID not found") 
  throw new Error('Unable to update record. Todo ID not found')
}

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const params = {
    TableName: todoTable,
    Key: {
        "todoId": todoId,
        "createdAt": createdAt
    },
    UpdateExpression: "set #name =:a, #dueDate =:b, done =:c ", 
    ExpressionAttributeNames: {
      "#name": "name",
      "#dueDate": "dueDate"
    },
    ExpressionAttributeValues: {
        ":a": updatedTodo.name,
        ":b": updatedTodo.dueDate,
        ":c": updatedTodo.done
      },
      ReturnValues:"UPDATED_NEW"
  };
  
  await docClient.update(params, function(err, data) {
    if (err) {
        logger.error("Unable to update", err) 
        console.error("Unable to update Todo. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        logger.info("Update success", data) 
        console.log("Update todo succeeded:", JSON.stringify(data, null, 2));
    }
  }).promise()
 

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
 
}
