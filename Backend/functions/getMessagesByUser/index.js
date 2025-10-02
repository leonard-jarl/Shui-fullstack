import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const username = event.pathParameters.username;

        if (!username) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Username is required in the path" })
            };
        }

        const command = new QueryCommand({
            TableName: "shuiAPI",
            IndexName: "UserMessagesGSI",
            KeyConditionExpression: "GSI2PK = :username",
            ExpressionAttributeValues: {
                ":username": { S: username },
            },
            ScanIndexForward: false
        });

        const { Items = [] } = await client.send(command);
        const messages = Items.map((item) => unmarshall(item));

        if (messages.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "No messages found for this user",
                    messages: []
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Messages for user ${username}`,
                messages,
            }),
        };

    } catch (error) {
        console.error("Error fetching user messages:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "An error occurred while fetching messages.",
                error: error.message,
            }),
        };
    }
};