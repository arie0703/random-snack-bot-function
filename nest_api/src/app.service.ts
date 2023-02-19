import { Injectable } from '@nestjs/common';
require('dotenv').config();
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

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getItems(): Promise<object[]> {
    var res: ScannedData = await client.send(new ScanCommand(params));
    return res.Items
  }
}
