---
title: HTML 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: HTML 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加快捷支持以在 Elysia 服务器上返回 HTML 的插件。首先通过 "bun add @elysiajs/html" 安装该插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 添加快捷支持以在 Elysia 服务器上返回 HTML 的插件。首先通过 "bun add @elysiajs/html" 安装该插件。
---

# HTML 插件

允许您使用 [JSX](#jsx) 和 HTML，并具有适当的头信息和支持。

安装方式：

```bash
bun add @elysiajs/html
```

然后使用它：

```tsx
import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .get(
        '/html',
        () => `
            <html lang='en'>
                <head>
                    <title>你好，世界</title>
                </head>
                <body>
                    <h1>你好，世界</h1>
                </body>
            </html>`
    )
    .get('/jsx', () => (
        <html lang='en'>
            <head>
                <title>你好，世界</title>
            </head>
            <body>
                <h1>你好，世界</h1>
            </body>
        </html>
    ))
    .listen(3000)
```

该插件将自动为响应添加 `Content-Type: text/html; charset=utf8` 头信息，添加 `<!doctype html>`，并将其转换为 Response 对象。

## JSX
Elysia HTML 基于 [@kitajs/html](https://github.com/kitajs/html)，允许我们在编译时将 JSX 定义为字符串，从而实现高性能。

需要使用 JSX 的文件名应以 **"x"** 后缀结尾：
- .js -> .jsx
- .ts -> .tsx

要注册 TypeScript 类型，请将以下内容附加到 **tsconfig.json**：
```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "Html.createElement",
        "jsxFragmentFactory": "Html.Fragment"
    }
}
```

就这样，现在您可以将 JSX 用作模板引擎：
```tsx
import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html' // [!code ++]

new Elysia()
    .use(html()) // [!code ++]
    .get('/', () => (
        <html lang="en">
            <head>
                <title>你好，世界</title>
            </head>
            <body>
                <h1>你好，世界</h1>
            </body>
        </html>
    ))
    .listen(3000)
```

如果出现错误 `Cannot find name 'Html'. Did you mean 'html'?`，则必须将此导入添加到 JSX 模板中：
```tsx
import { Html } from '@elysiajs/html'
```

重要的是，它必须以大写字母书写。

## XSS
Elysia HTML 基于 Kita HTML 插件，能够在编译时检测可能的 XSS 攻击。

您可以使用专用的 `safe` 属性来清理用户值，以防止 XSS 漏洞。
```tsx
import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .post('/', ({ body }) => (
        <html lang="en">
            <head>
                <title>你好，世界</title>
            </head>
            <body>
                <h1 safe>{body}</h1>
            </body>
        </html>
    ), {
        body: t.String()
    })
    .listen(3000)
```

然而，在构建大型应用时，最好有类型提示以检测代码库中可能的 XSS 漏洞。

要添加类型安全提醒，请安装：
```sh
bun add @kitajs/ts-html-plugin
```

然后将以下内容附加到 **tsconfig.json**：
```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "Html.createElement",
        "jsxFragmentFactory": "Html.Fragment",
        "plugins": [{ "name": "@kitajs/ts-html-plugin" }]
    }
}
```

## 选项

### contentType

-   类型: `string`
-   默认值: `'text/html; charset=utf8'`

响应的内容类型。

### autoDetect

-   类型: `boolean`
-   默认值: `true`

是否自动检测 HTML 内容并设置内容类型。

### autoDoctype

-   类型: `boolean | 'full'`
-   默认值: `true`

是否在响应中自动添加 `<!doctype html>`，如果未找到 `<html>` 开头的响应。

使用 `full` 也可以在没有此插件的情况下自动添加文档类型。

```ts
// 没有插件
app.get('/', () => '<html></html>')

// 有插件
app.get('/', ({ html }) => html('<html></html>'))
```

### isHtml

-   类型: `(value: string) => boolean`
-   默认值: `isHtml` (导出函数)

该函数用于检测一个字符串是否为 HTML。默认实现是长度大于 7，且以 `<` 开头并以 `>` 结尾。

请记住，实际上没有真正的方法来验证 HTML，因此默认实现是一种最佳猜测。
