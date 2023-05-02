---
title: 'SAMでGateway Responseのヘッダーを設定する'
date: '2023-05-02'
image: 'thumb.png'
---

AWS SAM で API Gateway の Gateway Response を設定する時詰まったのでメモ

## AWS SAM(Serverless Application Model) とは

AWS が提供するサーバーレスアプリケーションを開発、デプロイするためのフレームワーク。  
CloudFormation を拡張しており、CloudFormation よりもシンプルな書き方でリソースを定義することができる。

## Gateway Response とは

API Gateway の機能の一つで、API Gateway がクライアントに対して送信する、特定のエラーやステータスに関連するレスポンス。  
認証エラー、リクエストパラメータのバリデーションエラーなど、特定のパターンの時に返すエラーレスポンスの内容を設定することができる。

## Gateway Response を設定

リクエストの API キーが無効なとき返すエラーレスポンスに、CORS ヘッダーを設定する。CloudFormation だと以下のような書き方になる。

```yaml:cloudformation
AWSTemplateFormatVersion: 2010-09-09
Resources:
  GatewayResponse:
    Type: AWS::ApiGateway::GatewayResponse
    Properties:
      ResponseParameters:
        gatewayresponse.header.Access-Control-Allow-Origin: "https:example.com"
        gatewayresponse.header.Access-Control-Allow-Headers: "'X-Api-Key,Content-Type'"
        gatewayresponse.header.Access-Control-Allow-Methods: "'OPTIONS,GET,POST,PUT,DELETE'"
      ResponseTemplates:
        application/json: >
          {
            "status": "INVALID_API_KEY",
            "message": "Unauthorized"
          }
      ResponseType: INVALID_API_KEY
      RestApiId: !Ref RestApi
      StatusCode: 403
```

SAM では以下のような書き方になる。ヘッダーを設定する ResponseParameters の書き方が異なっている。  
ここの例がドキュメントでは見当たらなかったので詰まってしまった。

```yaml:sam
AWSTemplateFormatVersion: 2010-09-09
Resources:
  ServerlessApi:
    Type: AWS::Serverless::Api
    Properties:
      Name: test-api
      Cors:
        AllowHeaders: "'X-Api-Key,Content-Type'"
        AllowMethods: "'OPTIONS, GET, POST, PUT, DELETE'"
        AllowOrigin: "https:example.com"
      GatewayResponses:
        INVALID_API_KEY:
          StatusCode: 403
          ResponseParameters:
            Headers:
              Access-Control-Allow-Origin: "https:example.com"
              Access-Control-Allow-Headers: "'X-Api-Key,Content-Type'"
              Access-Control-Allow-Methods: "'OPTIONS,GET,POST,PUT,DELETE'"
          ResponseTemplates:
            application/json: >
              {
                "status": "INVALID_API_KEY",
                "message": "Unauthorized"
              }
```

上記の書き方で Gateway Response を設定することができる。

## 参考ページ

- https://github.com/aws/serverless-application-model/issues/815
