import express from "express";

require('dotenv').config();
const app = express();
const port: number = 3000;
const REGION: string = "ap-northeast-1";

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");

var client = new DynamoDBClient({ region: REGION });

var params = {
    TableName: 'snacks',
    credentials: fromIni({ profile: process.env.AWS_PROFILE })
};

interface ScannedData {
    $metadata: object
    Count: number
    Items: object[]
    ScannedCount: number
}

export const getItems = async () => {
    var res: ScannedData = await client.send(new ScanCommand(params));
    return res.Items
};

const apiRouter = express.Router();  
app.use("/", apiRouter);  

var snacks: object[] = [];

apiRouter.use(  
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        snacks = await getItems();
        next(); 
    }
);

apiRouter.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: snacks });
});
app.listen(port, () => console.log("ok, port =", port));       
