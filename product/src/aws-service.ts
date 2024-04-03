import * as AWS from 'aws-sdk'
import { CONFIG } from './config';

AWS.config.update({
    accessKeyId: CONFIG.ACCESS_KEY,
    secretAccessKey: CONFIG.SECRET_ACCESS_KEY,
    region: CONFIG.REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

export const scanItems = async (tableName: string) => {
    const scan = await dynamo.scan({
        TableName: tableName
    }).promise()

    return scan.Items
}

export const queryItems = async (query: AWS.DynamoDB.DocumentClient.QueryInput) => {
    const res = await dynamo.query(query).promise()
    return res.Items
}

export const putItem = async (tableName: string, item: Record<string, any>) => {
    const put = await dynamo.put({
        TableName: tableName,
        Item: item
    }).promise()
    return put
}