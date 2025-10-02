import { DynamoDBClient, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const messageId = event.pathParameters.id;

        if (!messageId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "There is no ID in the URL path" })
            };
        }

        const { text } = JSON.parse(event.body);

        if (!text || typeof text !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Text is required and must be a string." })
            };
        }

        if (text.length < 10 || text.length > 100) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Text must be between 10 and 100 characters long." })
            };
        }

        const queryCommand = new QueryCommand({
            TableName: "shuiAPI",
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": { S: messageId }
            }
        });

        const { Items } = await client.send(queryCommand);

        if (!Items || Items.length === 0) {
            return { 
                statusCode: 404, 
                body: JSON.stringify({ message: "Message not found" }) };
        }

        const item = unmarshall(Items[0]);

        const updateCommand = new UpdateItemCommand({
            TableName: "shuiAPI",
            Key: {
                pk: { S: item.pk },
                sk: { S: item.sk }
            },
            UpdateExpression: "SET #t = :text",
            ExpressionAttributeNames: { "#t": "text" },
            ExpressionAttributeValues: { ":text": { S: text } },
            ReturnValues: "ALL_NEW",
        });

        const updatedMessage = await client.send(updateCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Message updated successfully",
                updatedMessage: unmarshall(updatedMessage.Attributes),
            }),
        };

    } catch (error) {
        console.error("Error updating message:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error updating message",
                error: error.message,
            }),
        };
    }
};
