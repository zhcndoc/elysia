---
title: 全栈开发服务器 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 全栈开发服务器 - ElysiaJS

    - - meta
      - name: 'description'
        content: Bun 全栈开发服务器让我们可以在一个项目中同时开发前端和后端，无需任何打包工具。了解如何使用 Elysia 搭配支持 HMR 和 Tailwind 的 Bun 全栈开发服务器。

    - - meta
      - property: 'og:description'
        content: Bun 全栈开发服务器让我们可以在一个项目中同时开发前端和后端，无需任何打包工具。了解如何使用 Elysia 搭配支持 HMR 和 Tailwind 的 Bun 全栈开发服务器。
---

# Elysia 与 Bun 全栈开发服务器

Bun 1.3 引入了一个[全栈开发服务器](https://bun.com/docs/bundler/fullstack)，支持 HMR。

这允许我们直接使用 React，无需任何打包工具如 Vite 或 Webpack。

<video mute controls style="aspect-ratio: 3736/1630;">
  <source src="/assets/bun-fullstack.mp4" type="video/mp4" />
  加载视频时出错
</video>

你可以使用[此示例](https://github.com/saltyaom/elysia-fullstack-example)快速体验。

否则，请手动安装：

1. 安装 Elysia 静态资源插件
```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
	.use(await staticPlugin()) // [!code ++]
	.listen(3000)
```

:::tip
注意，我们需要在 `staticPlugin()` 前加上 `await`，以启用全栈开发服务器。

这是设置必要的 HMR 钩子所必需的。
:::

2. 创建 **public/index.html** 和 **index.tsx**

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React 应用</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				增加
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

3. 在 tsconfig.json 中启用 JSX

```json
{
  "compilerOptions": {
	"jsx": "react-jsx" // [!code ++]
  }
}
```

4. 访问 `http://localhost:3000/public` 查看效果。

这允许我们在一个项目中开发前端和后端，无需任何打包工具。

我们已验证全栈开发服务器支持 HMR、[Tailwind](#tailwind)、Tanstack Query、[Eden Treaty](/eden/overview) 以及路径别名。

## 自定义前缀路径

我们可以通过向 `staticPlugin` 传入 `prefix` 选项，修改默认的 `/public` 前缀。

```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
  	.use(
  		await staticPlugin({
  			prefix: '/' // [!code ++]
   		})
   )
  .listen(3000)
```

这样静态文件就会挂载到 `/` 而非 `/public`。

更多配置选项请查看[静态资源插件](/plugins/static)。

## Tailwind CSS

我们还可以在 Bun 全栈开发服务器中使用 Tailwind CSS。

1. 安装依赖

```bash
bun add tailwindcss@4
bun add -d bun-plugin-tailwind
```

2. 创建 `bunfig.toml`，内容如下：

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

3. 创建包含 Tailwind 指令的 CSS 文件

::: code-group

```css [public/global.css]
@tailwind base;
```

:::

4. 将 Tailwind 添加到你的 HTML 文件，或作为替代，将其引入 JavaScript/TypeScript 文件

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React 应用</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<link rel="stylesheet" href="tailwindcss"> <!-- [!code ++] -->
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import './global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				增加
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

## 路径别名

我们也可以在 Bun 全栈开发服务器中使用路径别名。

1. 在 `tsconfig.json` 中添加 `paths`

```json
{
  "compilerOptions": {
	"baseUrl": ".", // [!code ++]
	"paths": { // [!code ++]
	  "@public/*": ["public/*"] // [!code ++]
	} // [!code ++]
  }
}
```

2. 在代码中使用别名

```tsx
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import '@public/global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				增加
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

这会开箱即用，无需额外配置。

## 生产环境构建

你可以像构建普通 Elysia 服务器一样构建全栈服务器。

```bash
bun build --compile --target bun --outfile server src/index.ts
```

这会生成一个单一可执行文件 **server**。

运行 **server** 可执行文件时，请确保包含 **public** 文件夹，与开发环境类似。

更多信息请参见[部署到生产环境](/patterns/deploy)。