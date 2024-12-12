---
title: 快速开始 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 快速开始 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 是一个为 Bun 构建的库，唯一的前提条件。要开始，使用 "bun create elysia hi-elysia" 引导一个新项目，并使用 "bun dev" 启动开发服务器。这就是开始 ElysiaJS 所需的所有内容。

  - - meta
    - property: 'og:description'
      content: Elysia 是一个为 Bun 构建的库，唯一的前提条件。要开始，使用 "bun create elysia hi-elysia" 引导一个新项目，并使用 "bun dev" 启动开发服务器。这就是开始 ElysiaJS 所需的所有内容。
---

# 快速开始
Elysia 针对 Bun 进行了优化，Bun 是一个旨在作为 Node.js 替代品的 JavaScript 运行时。

您可以使用以下命令安装 Bun：
```bash
curl https://bun.sh/install | bash
```

## 自动安装
我们推荐使用 `bun create elysia` 启动一个新的 Elysia 服务器，这样会自动设置所有内容。

```bash
bun create elysia app
```

完成后，您应该在目录中看到文件夹名称为 `app`。

```bash
cd app
```

通过以下命令启动开发服务器：
```bash
bun dev
```

访问 [localhost:3000](http://localhost:3000) 应该会迎接您“Hello Elysia”。

::: tip
Elysia 提供了 `dev` 命令，能够在文件更改时自动重新加载您的服务器。
:::

## 手动安装
要手动创建一个新的 Elysia 应用程序，请将 Elysia 安装为包：

```typescript
bun add elysia
bun add -d @types/bun
```

这将安装 Elysia 和 Bun 的类型定义。

打开您的 `package.json` 文件并添加以下脚本：
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

这些脚本对应于开发应用程序的不同阶段：

- **dev** - 以开发模式启动 Elysia，并在代码更改时自动重载。
- **build** - 为生产使用构建应用程序。
- **start** - 启动 Elysia 生产服务器。

如果您使用 TypeScript，请确保创建并更新 `tsconfig.json`，将 `compilerOptions.strict` 设置为 `true`：
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 下一步
我们推荐查看以下内容之一：

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
</script>

<Deck>
    <Card title="核心概念 (5 分钟)" href="/key-concept">
    	Elysia 的核心概念及其使用方法。
    </Card>
    <Card title="教程 (15 分钟)" href="/tutorial">
    	Elysia 功能的逐步指南。
    </Card>
</Deck>

如果你有任何问题，请随时在我们的 [Discord](https://discord.gg/elysia) 社区中提问。
