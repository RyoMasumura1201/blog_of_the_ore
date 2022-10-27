---
title: 'Electron, Preact, Viteでmarkdownエディタを作った'
date: '2022-10-25'
image: 'Electron_Logo.png'
---

# やること

タイトルの通り

# なぜ

普段きちんとしたドキュメントやコードなどは VSCode で書くが、それとは別に、シンプルで雑に作業手順とかをメモする用の markdown エディタがほしかった  
普段ちょっとしたメモにはサクラエディタを使っているが、それの markdown 版がほしくなった  
絶対既存でいい方法、ツールはあるだろうけど、Electron 入門も兼ねて自作することにした

# 使用技術

- Electron
- TypeScript
- Preact
- Vite

# 使用したテンプレート

[いい感じのテンプレート](https://github.com/electron-vite/electron-vite-react)があったので使わせていただきました  
React×Vite で Electron を扱うテンプレートとなっており、ビルド周りやパッケージングなどの設定がすでになされており便利。  
例えば、Electron の[公式チュートリアル](https://www.electronjs.org/ja/docs/latest/tutorial/tutorial-prerequisites)では Electron Forge を使ってコードをアプリケーションへとパッケージするが、  
チュートリアルにそのまま従い実行するとプロジェクトコード全体をパッケージすることとなり、不必要にサイズが大きくなってしまう。  
このテンプレートでは dist 以下、つまり build 後のコードのみがパッケージの対象となるよう設定されている(electron-builder を使用)。  
パッケージ対象はアプリケーションサイズに割と影響があるようで、今回アプリケーションのサイズは 450MB=>150MB 程度まで絞れた。

```json:electron-builder.json5
{
 // ~~
  directories: {
    output: "release/${version}",
    buildResources: "electron/resources",
  },
  files: ["dist"],
// ~~
}
```

今回はできるだけ軽くしたかったので Preact にすり替えている。

# 実装

Electron はメインプロセスとレンダラープロセスの 2 種類のプロセスでデスクトップアプリを制御する
メインプロセスは

- アプリケーションウィンドウを作成して管理する
- アプリケーションのライフサイクル(開始から終了まで)を制御する
- OS にリクエストを投げる(ファイルを開く等)

といった役割を担当している  
レンダラープロセスはメインプロセスによって生成されたウィンドウにコンテンツをレンダリングする役割を担当する  
セキュリティのため互いのプロセスのメソッドを直接呼び出すことはできず、contextBridge という API を通してお互いのメソッドにアクセスしていく構造になっている。

**メインプロセス ⇄contextBridge⇄ レンダラープロセス**

今回実装する機能はシンプルに

- 既存の md ファイルを開く
- 編集した md ファイルを保存する

の二つとする。

## 既存の md ファイルを開く

メニューバーに md ファイルを開くメニューを配置するので、メインプロセス=>contextBridge=>レンダラープロセスの順でイベントが送信される流れとなる。  
メインプロセスにてメニューバーの設定を行う。  
`win?.webContents.send("openFile", fileData);`にて開くファイルのコンテンツをレンダラープロセスに向けて送信している。

```ts:electron/main/index.ts
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import { release } from "os";
import { join } from "path";
import fs from "fs";

// ~~

// メニューバーの作成
const template: MenuItemConstructorOptions[] = [];

const macMenu: Electron.MenuItemConstructorOptions[] = [
  {
    label: app.name,
    submenu: [
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
];

if (isMac) {
  template.push(...macMenu);
}

template.push({
  label: "File",
  submenu: [
    { label: "Open", click: () => openFile() },
    isMac ? { role: "close" } : { role: "quit" },
  ],
});
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
  // ~~

// mdファイルを選択し、開く
async function openFile() {
  if (win) {
    const result = await dialog.showOpenDialog(
      win,
      // 開くファイルを選択するダイアログの設定
      {
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            // 読み込み可能な拡張子を指定
            extensions: ["md"],
          },
        ],
      }
    );

    // ファイルを選択した後の処理
    if (result.filePaths.length > 0) {
      const path = result.filePaths[0];
      const textData = fs.readFileSync(path, "utf8");
      const fileData = { path, textData };
      // レンダラープロセスに送信
      win?.webContents.send("openFile", fileData);
    }
  }
}

// ~~
```

contextBridge にて、レンダラープロセスがメインプロセスから送られてくるイベントを受け取れるように処理を書く。

```ts:preload/index.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  //  ~~

  on: (channel: string, callback: (event, argv) => void) =>
    ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
});

```

レンダラープロセスの useEffect 内でメインプロセスから openFile イベントが送られてきた時の処理を記述する。  
今回は送られてきたファイルコンテンツを useState で保持するようにしている。

```tsx:src/App.tsx
const App = () => {
  const [content, setContent] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // ~~

  useEffect(() => {
    window.FileHandle.on("openFile", (_: never, fileData: OpenFileResult) => {
      setFilePath(fileData.path);
      setContent(fileData.textData);
      setRenderedContent(fileData.textData.replace(/\r\n|\r|\n/g, "  \n"));
      setIsSaved(false);
    });
  }, []);
  return (
    <>
      <head>
        <title>
          Makda Editor {filePath} {isSaved ? "(保存済み)" : ""}
        </title>
      </head>
      <div className="site-wrapper" onKeyDown={handleKeyDown}>
        <main>
          <div
            style={{
              display: "flex",
              height: "100vh",
            }}
          >
            <textarea
              style={{ width: "50%", height: "100%", fontSize: "14px" }}
              value={content}
              onChange={handleInputChange}
            />

            <ReactMarkdown
              remarkPlugins={[gfm]}
              className="markdown-body render-area"
            >
              {renderedContent}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
```

## 編集した md ファイルを保存する

ウィンドウ上で ctrl+s すると textarea 内のテキストが保存されるようにする。  
レンダラープロセス=>contextBridge=>メインプロセスの順でイベントが送信される。  
まず、メインプロセスにて保存処理を設定する。

```ts:electron/main/index.ts
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import { release } from "os";
import { join } from "path";
import fs from "fs";

// ~~

async function saveFile(_, content: string, filePath: string) {
  if (win) {
    const path = filePath
      ? filePath
      : dialog.showSaveDialogSync(win, {
          buttonLabel: "保存",
          filters: [{ name: "Text", extensions: ["md"] }],
        });

    // キャンセルで閉じた場合
    if (path === undefined) {
      return { status: undefined };
    }

    // ファイルの内容を返却
    try {
      fs.writeFileSync(path, content);

      return {
        status: true,
        path: path,
      };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
}

app.whenReady().then(() => {
  ipcMain.handle("save", saveFile);
  createWindow();
});

```

contextBridge にて、レンダラープロセスからファイル保存イベントが送信されたときメインプロセスのファイル保存処理を立ち上げるよう設定する

```ts:preload/index.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("FileHandle", {
  saveFile: async (content: string, filePath: string) => {
    const result = await ipcRenderer.invoke("save", content, filePath);
    return result;
  },
  // ~~
});

```

ctrl+s で保存イベントを送信する

```tsx:src/App.tsx
import { useState, useEffect } from "preact/hooks";
import { OpenFileResult } from "@/types/FileHandle";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

const App = () => {
  const [content, setContent] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // ~~

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    let charCode = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && charCode === "s") {
      e.preventDefault();
      // 保存イベントを送信
      const { status, path, message } = await window.FileHandle.saveFile(
        content,
        filePath
      );
      if (status && path) {
        setFilePath(path);
        setIsSaved(true);
      } else if (message) {
        alert(message);
      }
    }
  };
  // ~~
  return (
  // ~~
  );
};

export default App;
```

# 最後に

以下のように contextBridge を通してメインプロセスとレンダラープロセスがイベントを送信し合う。  
とりあえず気にしていた起動速度は割と満足できた。色々雑なので使いながら直していきたい。  
リポジトリは[こちら](https://github.com/RyoMasumura1201/markdown-editor)

# 参考記事

- [https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e](https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e)
- [https://blog.katsubemakito.net/nodejs/electron/ipc-for-contextbridge](https://blog.katsubemakito.net/nodejs/electron/ipc-for-contextbridge)
- [https://qiita.com/yuu_1st/items/c461497efccb0312fa9e](https://qiita.com/yuu_1st/items/c461497efccb0312fa9e)
