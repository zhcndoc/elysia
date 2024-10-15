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

## 结构
如果您不严格偏爱特定的约定，这里是 Elysia 推荐的文件结构：
- **src** - 任何与 Elysia 服务器开发相关的文件。
    - **index.ts** - 您的 Elysia 服务器的入口点，设置全局插件的理想位置。
    - **setup.ts** - 组成多个插件，用作服务定位器。
    - **controllers** - 封装多个端点的实例。
    - **libs** - 实用功能。
    - **models** - Elysia 实例的数据类型对象（DTO）。
    - **types** - 如有需要，供共享 TypeScript 类型使用。
- **test** - Elysia 服务器的测试文件。
