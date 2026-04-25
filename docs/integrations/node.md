---
title: 与 Node.js 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Node.js 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 提供运行时适配器以在多个运行时环境中运行 Elysia，包括 Node.js、Cloudflare Workers 等

    - - meta
      - property: 'og:description'
        content: Elysia 提供运行时适配器以在多个运行时环境中运行 Elysia，包括 Node.js、Cloudflare Workers 等
---

# 与 Node.js 集成
Elysia 提供运行时适配器以在多个运行时环境中运行 Elysia，包括 Node.js。

要在 Node.js 上运行 Elysia，只需安装 Node 适配器。

::: code-group

```bash [bun]
bun add elysia @elysia/node
```

```bash [pnpm]
pnpm add elysia @elysia/node
```

```bash [npm]
npm install elysia @elysia/node
```

```bash [yarn]
yarn add elysia @elysia/node
```

:::

然后将 Node 适配器应用到你的主 Elysia 实例。

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysia/node' // [!code ++]

const app = new Elysia({ adapter: node() }) // [!code ++]
	.get('/', () => 'Hello Elysia')
	.listen(3000)
```

这就是你运行 Elysia 于 Node.js 所需的一切。

### 额外设置（可选）
为了获得最佳体验，我们推荐安装 `tsx` 或 `ts-node` 配合 `nodemon` 使用。

`tsx` 是一个 CLI 工具，可以将 TypeScript 转译成 JavaScript，并带有热重载及其他现代开发环境中期待的诸多功能。

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

这些脚本代表应用开发的不同阶段：

- **dev** - 以开发模式启动 Elysia，代码变更时自动重载。
- **build** - 构建应用以供生产使用。
- **start** - 启动生产环境的 Elysia 服务器。

确保创建一个 `tsconfig.json` 文件：

```bash
tsc --init
```

别忘了更新 `tsconfig.json`，设置 `compilerOptions.strict` 为 `true`：
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

这样你就能享受热重载和 JSX 支持，获得类似于 `bun dev` 的开发体验。

### pnpm
如果你使用 pnpm，[pnpm 默认不会自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，因此你需要手动安装额外依赖。
```bash
pnpm add @sinclair/typebox openapi-types
```