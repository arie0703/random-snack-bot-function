# API server

TypeScript + Node.js + ExpressでDynamoDBからデータを取得するAPIサーバを作成する

## AWS認証情報の設定

`~/.aws/credentials`に認証情報を登録する

```
[aws-account-1]
aws_access_key_id = XXXXXXXXXXXX
aws_secret_access_key = XXXXXXXXXXX
```

`.env`でアカウント名を設定する

```
AWS_PROFILE=aws-account-1
```

## コマンド

`npx tsc` - ビルド

`node ./dist/index.js ` - サーバー起動

