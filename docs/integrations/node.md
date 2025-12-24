---
title: 与 Node.js 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Node.js 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 提供了运行时适配器，可在多个运行时环境中运行 Elysia，包括 Node.js、Cloudflare Worker 等

    - - meta
      - property: 'og:description'
        content: Elysia 提供了运行时适配器，可在多个运行时环境中运行 Elysia，包括 Node.js、Cloudflare Worker 等
---

# 与 Node.js 集成
Elysia 提供了运行时适配器，可在多个运行时环境中运行 Elysia，包括 Node.js。

要在 Node.js 上运行 Elysia，只需安装 Node 适配器。

::: code-group

```bash [bun]
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

然后将 node 适配器应用到你的主 Elysia 实例中。

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node' // [!code ++]

const app = new Elysia({ adapter: node() }) // [!code ++]
	.get('/', () => 'Hello Elysia')
	.listen(3000)
```

这就是你运行 Elysia 于 Node.js 所需的一切。

### 额外设置（可选）
为了获得最佳体验，我们建议安装 `tsx` 或 `ts-node` 以及 `nodemon`。

`tsx` 是一个 CLI 工具，它能将 TypeScript 转译为 JavaScript，支持热重载以及你期望现代开发环境具备的诸多功能。

::: code-group

```bash [bun]
bun add -d tsx @types/node typescript
```

```bash [pnpm]
pnpm add -D tsx @types/node typescript
```

```bash [npm]
npm install --save-dev tsx @types/node typescript
```

```bash [yarn]
yarn add -D tsx @types/node typescript
```

:::

然后打开你的 `package.json` 文件并添加以下脚本：

```json
{
   	"scripts": {
  		"dev": "tsx watch src/index.ts",
    	"build": "tsc src/index.ts --outDir dist",
  		"start": "NODE_ENV=production node dist/index.js"
   	}
}
```

这些脚本指代开发应用的不同阶段：

- **dev** - 在开发模式下启动 Elysia，并在代码更改时自动重载。
- **build** - 构建应用以供生产使用。
- **start** - 启动 Elysia 生产服务器。

确保创建 `tsconfig.json` 文件：

```bash
tsc --init
```

别忘了将 `tsconfig.json` 中的 `compilerOptions.strict` 设置为 `true`：
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

这将为你提供热重载和 JSX 支持，使你以类似于 `bun dev` 的体验运行 Elysia。

### pnpm
如果你使用 pnpm，[pnpm 默认不会自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，这就需要你手动安装额外的依赖。
```bash
pnpm add @sinclair/typebox openapi-types
```