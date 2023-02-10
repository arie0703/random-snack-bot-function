import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const REGION = "ap-northeast-1";


var client = new DynamoDBClient({ region: REGION });

var params = {
    TableName: 'snacks',
};

export const getItems = async () => {
    return await client.send(new ScanCommand(params));
};


export const handler = async (event) => {

    const res = await getItems();
    // console.log(res.Items)
    const length = res.Count;

    var randomNum = Math.floor(Math.random() * length);
    const selectedItem = res.Items[randomNum].name.S;

    console.log(selectedItem, randomNum);
    return {
        "isBase64Encoded": true,
        "statusCode": 200,
        "headers": {},
        "body": selectedItem
    };


};
