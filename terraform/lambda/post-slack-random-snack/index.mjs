import request from 'request';
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
    const length = res.Count;
    var randomNum = Math.floor(Math.random() * length);
    const selectedItem = res.Items[randomNum].name.S;

    const dataString = JSON.stringify({ "snack_name": selectedItem });
    const headers = { "Content-Type": "application/json" };

    const options = {
        url: process.env.WEBHOOK_URL,
        headers: headers,
        body: dataString,
        method: "POST",
    };


    const response = await new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(body);
                resolve(body);
            }
        });
    });

    return response;

};
