---
title: 'NextAuthによるTwitterログイン機能の実装'
date: '2021-11-14'
image: '20211114-index-nextauth.png'
---

NextAuth による Twitter ログイン機能を実装した。  
つまづいた(主に Callback URL 設定)ので書いておく。

# Twitter Developer で App を作成

Twitter Developer の登録、App の作成方法は[こちら](https://www.itti.jp/web-direction/how-to-apply-for-twitter-api/)などを参考に。  
API Key と Secret Key はコピーしておく。

# 環境変数設定

.env.local ファイルを作成。コピーした API Key と Secret Key を環境変数として与える

```
TWITTER_CLIENT_ID="コピーしたAPI Key"
TWITTER_CLIENT_SECRET="コピーしたSecret Key"
```

# URL 設定

# NextAuth のインストール、設定

```bash
npm install next-auth
```

でインストール。

公式ドキュメント通りに pages/api/auth 配下に[...nextauth].ts を作成する。  
こちら NextAuth の設定ファイルとなっており、以下のように記述することで Twitter ログイン用のページにリダイレクトしてくれるようになる。

```ts:pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
})

```
