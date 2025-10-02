import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const command = new QueryCommand({
            TableName: "shuiAPI",
            IndexName: "AllMessagesGSI",
            KeyConditionExpression: "GSI1PK = :pk",
            ExpressionAttributeValues: {
                ":pk": { S: "MESSAGES" },
            },
            ScanIndexForward: false
        });

        const { Items = [] } = await client.send(command);
        const messages = Items.map((item) => unmarshall(item));

        if (messages.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "No messages exist",
                    messages: []
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Here are all messages",
                messages,
            }),
        };

    } catch (error) {
        console.error("An error occurred while fetching messages:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "An error occurred while fetching messages.",
                error: error.message,
            }),
        };
    }
};
