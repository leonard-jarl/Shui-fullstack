import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const { username, text } = JSON.parse(event.body);

        if (!username || typeof username !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Username is required and must be a string." })
            };
        }

        if (username.length < 2 || username.length > 15) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Username must be between 2 and 15 characters long." })
            };
        }

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

        const messageId = `MESSAGE-${uuidv4().toUpperCase().slice(0, 5)}`;
        const createdAt = new Date().toISOString();

        const message = {
            pk: { S: messageId },
            sk: { S: createdAt },
            id: { S: messageId },
            username: { S: username },
            text: { S: text },
            createdAt: { S: createdAt },
            GSI1PK: { S: "MESSAGES" },
            GSI2PK: { S: username },
        };

        await client.send(new PutItemCommand({
            TableName: "shuiAPI",
            Item: message
        }));

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Message was created successfully",
                message: {
                    id: messageId,
                    username,
                    text,
                    createdAt
                }
            })
        };
    } catch (error) {
        console.error("Error creating message:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error creating message",
                error: error.message
            }),
        };
    }
};