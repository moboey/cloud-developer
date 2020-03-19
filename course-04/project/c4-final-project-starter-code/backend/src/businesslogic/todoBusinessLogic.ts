import { createLogger } from '../utils/logger'
import { TodoAccess } from '../datalayer/todoDatalayer'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid' 
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const todoAccess = new TodoAccess()

const logger = createLogger('todoBusinesslogic')

export async function getAllGroups(userId:string): Promise<TodoItem[]> {
    logger.info('Getting todos')
    return todoAccess.getAllTodo(userId)
}

export async function createTodo(createTodoReq: CreateTodoRequest,userId: string): Promise<TodoItem> {
    logger.info('creating todos')  
    
    return todoAccess.createTodo({
        userId: userId,
        todoId:  uuid.v4(), 
        createdAt: new Date().toISOString(),
        name: createTodoReq.name,
        dueDate: createTodoReq.dueDate,
        done: false
    });
}

export async function updateTodo(updateTodoReq:UpdateTodoRequest, todoId:string) {
    logger.info('Update todos')    
    todoAccess.updateTodo(todoId, updateTodoReq.name, updateTodoReq.dueDate, updateTodoReq.done)
}

export async function deleteTodo(todoId:string) {
    logger.info('Deleting todos')    
    todoAccess.deleteTodo(todoId)
}

export async function generateUploadURL(todoId:string): Promise<string>{
    logger.info('Generate upload URL')    
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}` 
    todoAccess.updateURL(todoId, attachmentUrl)
    const url = getUploadUrl(todoId)
    logger.info("Generated signed URL ", JSON.stringify(url)) 
    return url 
}


function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    })
  }