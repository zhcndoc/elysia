---
title: 快速入门 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 快速入门 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一个为 Bun 构建的库，唯一的先决条件。要开始，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是快速入门或开始使用 ElysiaJS 所需的全部内容。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个为 Bun 构建的库，唯一的先决条件。要开始，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是快速入门或开始使用 ElysiaJS 所需的全部内容。
---

<script setup>
import Card from './components/nearl/card.vue'
import Deck from './components/nearl/card-deck.vue'
import Tab from './components/fern/tab.vue'
</script>

# 快速入门

Elysia 是一个支持多种运行环境的 TypeScript 后端框架，但已针对 Bun 进行了优化。

然而，你也可以在其他运行环境如 Node.js 中使用 Elysia。

<Tab
	id="quickstart"
	:names="['Bun', 'Node.js', 'Web Standard']"
	:tabs="['bun', 'node', 'web-standard']"
>

<template v-slot:bun>

Elysia 针对 Bun 进行了优化，Bun 是一种旨在作为 Node.js 的直接替代品的 JavaScript 运行时。

你可以使用下面的命令安装 Bun：

::: code-group

```bash [MacOS/Linux]
curl -fsSL https://bun.sh/install | bash
```

```bash [Windows]
powershell -c "irm bun.sh/install.ps1 | iex"
```

:::

<Tab
	id="quickstart"
	:names="['自动安装', '手动安装']"
	:tabs="['auto', 'manual']"
>

<template v-slot:auto>

我们建议使用 `bun create elysia` 启动一个新的 Elysia 服务器，该命令会自动设置所有内容。

```bash
bun create elysia app
```

完成后，你应该会在目录中看到名为 `app` 的文件夹。

```bash
cd app
```

通过以下命令启动开发服务器：

```bash
bun dev
```

访问 [localhost:3000](http://localhost:3000) 应该会显示 "Hello Elysia"。

::: tip
Elysia 提供了 `dev` 命令，能够在文件更改时自动重新加载你的服务器。
:::

</template>

<template v-slot:manual>

要手动创建一个新的 Elysia 应用，请将 Elysia 作为一个包安装：

```typescript
bun add elysia
bun add -d @types/bun
```

这将安装 Elysia 和 Bun 的类型定义。

创建一个新文件 `src/index.ts`，并添加以下代码：

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

console.log(
	`🦊 Elysia 正在运行在 ${app.server?.hostname}:${app.server?.port}`
)
```

打开你的 `package.json` 文件，并添加以下脚本：

```json
{
   	"scripts": {
  		"dev": "bun --watch src/index.ts",
  		"build": "bun build src/index.ts --target bun --outdir ./dist",
  		"start": "NODE_ENV=production bun dist/index.js",
  		"test": "bun test"
   	}
}
```

这些脚本适用于应用程序开发的不同阶段：

- **dev** - 在开发模式下启动 Elysia，并在代码更改时自动重新加载。
- **build** - 为生产使用构建应用程序。
- **start** - 启动 Elysia 生产服务器。

如果你正在使用 TypeScript，请确保创建并更新 `tsconfig.json`，将 `compilerOptions.strict` 设置为 `true`：

```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>
</Tab>

</template>

<template v-slot:node>

Node.js 是一个用于服务器端应用的 JavaScript 运行时，也是 Elysia 支持的最流行的运行时。

您可以使用以下命令安装 Node.js：

::: code-group

```bash [MacOS]
brew install node
```

```bash [Windows]
choco install nodejs
```

```bash [apt (Linux)]
sudo apt install nodejs
```

```bash [pacman (Arch)]
pacman -S nodejs npm
```

:::

## 设置

我们建议在你的 Node.js 项目中使用 TypeScript。

<Tab
	id="language"
	:names="['TypeScript', 'JavaScript']"
	:tabs="['ts', 'js']"
>

<template v-slot:ts>

要使用 TypeScript 创建一个新的 Elysia 应用，我们建议通过 `tsx` 安装 Elysia：

::: code-group

```bash [bun]
bun add elysia @elysiajs/node && \
bun add -d tsx @types/node typescript
```

```bash [pnpm]
pnpm add elysia @elysiajs/node && \
pnpm add -D tsx @types/node typescript
```

```bash [npm]
npm install elysia @elysiajs/node && \
npm install --save-dev tsx @types/node typescript
```

```bash [yarn]
yarn add elysia @elysiajs/node && \
yarn add -D tsx @types/node typescript
```

:::

这将安装 Elysia、TypeScript 和 `tsx`。

`tsx` 是一个 CLI，可以将 TypeScript 转换为 JavaScript，具有热重载和现代开发环境所需的其他功能。

创建一个新文件 `src/index.ts` 并添加以下代码：

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia 正在运行在 ${hostname}:${port}`
		)
	})
```

打开你的 `package.json` 文件并添加以下脚本：

```json
{
   	"scripts": {
  		"dev": "tsx watch src/index.ts",
    	"build": "tsc src/index.ts --outDir dist",
  		"start": "NODE_ENV=production node dist/index.js"
   	}
}
```

这些脚本适用于应用程序开发的不同阶段：

- **dev** - 在开发模式下启动 Elysia，并在代码更改时自动重新加载。
- **build** - 为生产使用构建应用程序。
- **start** - 启动 Elysia 生产服务器。

确保创建 `tsconfig.json`

```bash
npx tsc --init
```

不要忘记更新 `tsconfig.json`，将 `compilerOptions.strict` 设置为 `true`：
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

<template v-slot:js>

::: warning
如果您在没有 TypeScript 的情况下使用 Elysia，您可能会错过一些功能，比如自动补全、先进的类型检查和端到端的类型安全，这些都是 Elysia 的核心功能。
:::

要使用 JavaScript 创建一个新的 Elysia 应用，首先安装 Elysia：

::: code-group

```bash [pnpm]
bun add elysia @elysiajs/node
```

```bash [pnpm]
pnpm add elysia @elysiajs/node
```

```bash [npm]
npm install elysia @elysiajs/node
```

```bash [yarn]
yarn add elysia @elysiajs/node
```

:::

这将安装 Elysia 和 TypeScript。

创建一个新文件 `src/index.ts` 并添加以下代码：

```javascript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia 正在运行在 ${hostname}:${port}`
		)
	})
```

打开你的 `package.json` 文件并添加以下脚本：

```json
{
	"type": "module",
   	"scripts": {
  		"dev": "node src/index.ts",
  		"start": "NODE_ENV=production node src/index.js"
   	}
}
```

这些脚本适用于应用程序开发的不同阶段：

- **dev** - 在开发模式下启动 Elysia，并在代码更改时自动重新加载。
- **start** - 启动 Elysia 生产服务器。

确保创建 `tsconfig.json`

```bash
npx tsc --init
```

不要忘记更新 `tsconfig.json`，将 `compilerOptions.strict` 设置为 `true`：
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

</Tab>

</template>

<template v-slot:web-standard>

Elysia 是一个符合 WinterCG 标准的库，这意味着如果一个框架或运行时支持 Web 标准的请求/响应，它就可以运行 Elysia。

首先，使用下面的命令安装 Elysia：

::: code-group

```bash [bun]
bun install elysia
```

```bash [pnpm]
pnpm install elysia
```

```bash [npm]
npm install elysia
```

```bash [yarn]
yarn add elysia
```

:::

接下来，选择一个支持 Web 标准请求/响应的运行时。

我们有一些推荐：

<Deck>
    <Card title="Next.js" href="/integrations/nextjs">
   		Elysia 作为 Next.js API 路由。
    </Card>
    <Card title="Expo" href="/integrations/expo">
   		Elysia 作为 Expo 应用路由 API。
    </Card>
	<Card title="Astro" href="/integrations/astro">
			Elysia 作为 Astro API 路由。
	</Card>
	<Card title="Nuxt" href="/integrations/nuxt">
   		Elysia 作为 Nuxt API 路由。
    </Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
			Elysia 作为 SvelteKit API 路由。
	</Card>
</Deck>

### 没在列表上？

如果您使用自定义运行时，您可以访问 `app.fetch` 手动处理请求和响应。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

export default app.fetch

console.log(
	`🦊 Elysia 正在运行在 ${app.server?.hostname}:${app.server?.port}`
)
```

</template>

</Tab>
