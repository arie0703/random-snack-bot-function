import express from "express";
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();
const port: number = 3000;
const REGION: string = "ap-northeast-1";

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");

var client = new DynamoDBClient({ region: REGION, credentials: fromIni({ profile: process.env.AWS_PROFILE }) });

app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = express.Router();
app.use("/post", apiRouter);  

// テーブルに項目を挿入
async function putItem (req: express.Request) {

    var response: object = {}
    try {
        const command = new PutItemCommand({
            TableName: 'snacks',
            Item: {
                name: { S: req.body.snack_name },
            },
        });
        response = await client.send(command);
        return response;

    } catch (err) {
        console.log(err);
    }

    return response;
}

var output: object = {};

apiRouter.use(
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        output = await putItem(req);
        next();
    }
);

// POST時にレスポンスを返す
app.post("/post", (req: express.Request, res: express.Response) => {
    res.send({ output: output });
});



app.listen(port, () => console.log("ok, port =", port));       
