import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

const todoTable = process.env.TODO_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body) 
  logger.info("Create todo", newTodo) 
  const createdAt = new Date().toISOString()
  const todoId = uuid.v4() 
 const name = newTodo.name
 const dueDate = newTodo.dueDate
 const item = 
 {
   todoId,
   createdAt,
   name,
   dueDate,
   done: false
 }
/*
 const params = {
  TableName:todoTable,
  Key:{
    'todoId': todoId,
    'createdAt': createdAt,
    'name': name,
    'dueDate': dueDate,
    'done': false
}  
};*/

  // TODO: Implement creating a new TODO item
 // await docClient.put(params).promise()

    await docClient.put({
      TableName: todoTable,
      Item: item
    }, function(err, data) {
      if (err) {
          logger.error("Unable to create", err)  
      } else {
          logger.info("Create success", data)  
      }
  }).promise()
 
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item 
    })
  }
 
}
