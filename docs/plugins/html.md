---
title: HTML 插件
head:
    - - meta
      - property: 'og:title'
        content: HTML 插件 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 的插件，提供在 Elysia 服务器中返回 HTML 的快捷支持。使用命令 "bun add @elysiajs/html" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，提供在 Elysia 服务器中返回 HTML 的快捷支持。使用命令 "bun add @elysiajs/html" 安装插件。
---

# HTML 插件

允许你使用 [JSX](#jsx) 和 HTML，并具有适当的头部和支持。

安装：

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
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
    )
    .get('/jsx', () => (
        <html lang='en'>
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
    ))
    .listen(3000)
```

此插件将自动为响应添加 `Content-Type: text/html; charset=utf8` 头部，添加 `<!doctype html>` 并将其转换为 Response 对象。

## JSX
Elysia HTML 基于 [@kitajs/html](https://github.com/kitajs/html)，允许我们在编译时将 JSX 定义为字符串以实现高性能。

将需要使用 JSX 的文件命名以 **“x”** 结尾：
- .js -> .jsx
- .ts -> .tsx

要注册 TypeScript 类型，请将以下内容追加到 **tsconfig.json**：
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

现在，你可以将 JSX 作为模板引擎使用了：
```tsx
import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html' // [!code ++]

new Elysia()
    .use(html()) // [!code ++]
    .get('/', () => (
        <html lang="en">
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
    ))
    .listen(3000)
```

If the error `Cannot find name 'Html'. Did you mean 'html'?` occurs, this import must be added to the JSX template:
```tsx
import { Html } from '@elysiajs/html'
```

It is important that it is written in uppercase.

## XSS
Elysia HTML 基于 Kita HTML 插件以在编译时检测可能的 XSS 攻击。

你可以使用专用的 `safe` 属性来对用户输入进行清理，以预防 XSS 漏洞。
```tsx
import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .post('/', ({ body }) => (
        <html lang="en">
            <head>
                <title>Hello World</title>
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

然而，在构建大型应用程序时，最好使用类型提醒来检测代码中可能的 XSS 漏洞。

要添加类型安全提醒，请安装：
```sh
bun add @kitajs/ts-html-plugin
```

然后追加以下内容到 **tsconfig.json**
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

-   类型：`string`
-   默认值：`'text/html; charset=utf8'`

响应的内容类型。

### autoDetect

-   类型：`boolean`
-   默认值：`true`

是否自动检测 HTML 内容并设置内容类型。

### autoDoctype

-   类型：`boolean | 'full'`
-   默认值：`true`

是否自动在以 `<html>` 开头的响应中添加 `<!doctype html>`，如果找不到。

使用 `full` 还可以在没有该插件的情况下自动添加文档类型。

```ts
// 没有该插件
app.get('/', () => '<html></html>')

// 使用该插件
app.get('/', ({ html }) => html('<html></html>'))
```

### isHtml

-   类型：`(value: string) => boolean`
-   默认值：`isHtml` (导出的函数)

该函数用于检测字符串是否为 HTML。默认实现是如果长度大于 7，以 `<` 开头并以 `>` 结尾。

请记住，没有真正的方法来验证 HTML，因此默认实现只是一个最佳猜测。