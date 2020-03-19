import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
const logger = createLogger('uploadImage')
import { generateUploadURL } from '../../businesslogic/todoBusinessLogic'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('update URL', event.pathParameters.todoId)
  const url = await generateUploadURL(todoId)

  return {
    statusCode: 201,
    body: JSON.stringify({ uploadUrl: url })
  }

  /*
   const result = await docClient.query({
     TableName: todoTable,
     KeyConditionExpression: 'todoId = :todoId',
     ExpressionAttributeValues: {
       ':todoId': todoId
     }
   }).promise()
 
 
   if (result.Count == 0) {
     logger.error("Unable to update image URL. Todo ID not found")
     throw new Error('Unable to update image URL. Todo ID not found')
   }
 
   const createdAt = result.Items[0].createdAt
   const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
 
   const params = {
     TableName: todoTable,
     Key: {
       "todoId": todoId,
       "createdAt": createdAt
     },
     UpdateExpression: "set attachmentUrl =:attachmentUrl",
     ExpressionAttributeValues: {
       ":attachmentUrl": attachmentUrl
     },
     ReturnValues: "UPDATED_NEW"
   };
 
   await docClient.update(params, function (err, data) {
     if (err) {
       logger.error("Unable to update image URL", err)
       console.error("Unable to update image URL. Error JSON:", JSON.stringify(err, null, 2));
     } else {
       logger.info("Update success", data)
       console.log("Update image URL succeeded:", JSON.stringify(data, null, 2));
     }
   }).promise()
   
   const url = getUploadUrl(todoId)
   logger.info("Generated signed URL ", url)
   console.log("Generated signed URL", JSON.stringify(url));
  
 
   return {
     statusCode: 200,
     headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true
     },
     body: JSON.stringify({ uploadUrl:url })
   }
 }
 
 
 
 
 function getUploadUrl(imageId: string) {
   return s3.getSignedUrl('putObject', {
     Bucket: bucketName,
     Key: imageId,
     Expires: urlExpiration
   })
 }
 */

})


handler.use(
  cors({
    credentials: true
  })
)