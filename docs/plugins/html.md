---
title: HTML 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: HTML 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加 HTML 返回快捷支持的插件。首先通过 "bun add @elysiajs/html" 安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 添加 HTML 返回快捷支持的插件。首先通过 "bun add @elysiajs/html" 安装插件。
---

# HTML 插件

允许您在 Elysia 服务器中使用 [JSX](#jsx) 和 HTML，并提供适当的头部和支持。

安装方法：

```bash
bun add @elysiajs/html
```

然后使用它：

```tsx twoslash
import React from 'react'
// ---cut---
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

该插件将自动在响应中添加 `Content-Type: text/html; charset=utf8` 头部，添加 `<!doctype html>`，并将其转换为一个响应对象。

## JSX

Elysia HTML 基于 [@kitajs/html](https://github.com/kitajs/html)，允许我们在编译时将 JSX 定义为字符串，以实现高性能。

需要使用 JSX 的文件名称应以后缀 **"x"** 结尾：

- .js -> .jsx
- .ts -> .tsx

要注册 TypeScript 类型，请将以下内容添加到 **tsconfig.json**：

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

就是这样，现在您可以将 JSX 用作模板引擎：

```tsx twoslash
import React from 'react'
// ---cut---
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

如果出现错误 `Cannot find name 'Html'. Did you mean 'html'?`，则必须将此导入添加到 JSX 模板中：

```tsx
import { Html } from '@elysiajs/html'
```

务必以大写字母书写。

## XSS

Elysia HTML 基于 Kita HTML 插件，在编译时检测可能的 XSS 攻击。

您可以使用专用的 `safe` 属性来清理用户值，以防止 XSS 漏洞。

```tsx
import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
	.use(html())
	.post(
		'/',
		({ body }) => (
			<html lang="en">
				<head>
					<title>Hello World</title>
				</head>
				<body>
					<h1 safe>{body}</h1>
				</body>
			</html>
		),
		{
			body: t.String()
		}
	)
	.listen(3000)
```

然而，在构建大型应用时，最好有类型提醒以检测代码库中可能的 XSS 漏洞。

要添加类型安全提醒，请安装：

```sh
bun add @kitajs/ts-html-plugin
```

然后在 **tsconfig.json** 中添加以下内容：

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

- 类型: `string`
- 默认值: `'text/html; charset=utf8'`

响应的内容类型。

### autoDetect

- 类型: `boolean`
- 默认值: `true`

是否自动检测 HTML 内容并设置内容类型。

### autoDoctype

- 类型: `boolean | 'full'`
- 默认值: `true`

是否在响应开头是 `<html>` 时自动添加 `<!doctype html>`，如果未找到。

使用 `full` 还可以在没有此插件的响应中自动添加文档类型。

```ts
// 没有插件
app.get('/', () => '<html></html>')

// 有插件
app.get('/', ({ html }) => html('<html></html>'))
```

### isHtml

- 类型: `(value: string) => boolean`
- 默认: `isHtml` （导出的函数）

该函数用于检测一个字符串是否为 HTML。默认实现是如果长度大于 7，且以 `<` 开头并以 `>` 结尾。

请注意，没有真正的方法来验证 HTML，因此默认实现只是一个最佳猜测。