import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'

const logger = createLogger('datalayer')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
    }
    async getAllTodo(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: process.env.USERID_INDEX,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating todos')
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()
        return todoItem
    }

    async getTodo(todoId: string): Promise<TodoItem> {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()
        const items = result.Items[0]
        return items as TodoItem
    }

    async updateTodo(todoId: string, name: string, dueDate: string, done: boolean) {
        const result = await this.getTodo(todoId)
        const params = {
            TableName: this.todoTable,
            Key: {
                "todoId": result.todoId,
                "createdAt": result.createdAt
            },
            UpdateExpression: "set #name =:a, #dueDate =:b, done =:c ",
            ExpressionAttributeNames: {
                "#name": "name",
                "#dueDate": "dueDate"
            },
            ExpressionAttributeValues: {
                ":a": name,
                ":b": dueDate,
                ":c": done
            },
            ReturnValues: "UPDATED_NEW"
        };
        await this.docClient.update(params, function (err, data) {
            if (err) {
                logger.error("Unable to update", err)
                console.error("Unable to update Todo. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                logger.info("Update success", data)
                console.log("Update todo succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise()
    }

    async deleteTodo(todoId: string) {
        const result = await this.getTodo(todoId)
        const params = {
            TableName: this.todoTable,
            Key: {
                "todoId": result.todoId,
                "createdAt": result.createdAt
            }
        };

        await this.docClient.delete(params, function (err, data) {
            if (err) {
                logger.error("Unable to delete", err)
                console.error("Unable to delete Todo. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                logger.info("Delete success", data)
                console.log("Delete todo succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise()
    }

    async updateURL(todoId: string, url: string) {
        const result = await this.getTodo(todoId)
        const params = {
            TableName: this.todoTable,
            Key: {
                "todoId": result.todoId,
                "createdAt": result.createdAt
            },
            UpdateExpression: "set attachmentUrl =:attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": url
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(params, function (err, data) {
            if (err) {
                logger.error("Unable to update image URL", err)
                console.error("Unable to update image URL. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                logger.info("Update success", data)
                console.log("Update image URL succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise()

    }
} 