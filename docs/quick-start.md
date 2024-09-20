---
title: 快速开始
head:
  - - meta
    - property: 'og:title'
      content: 快速开始 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: Elysia 是为 Bun 构建的库，也是唯一的先决条件。要开始使用，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是快速启动或开始使用 ElysiaJS 所需的一切。

  - - meta
    - property: 'og:description'
      content: Elysia 是为 Bun 构建的库，也是唯一的先决条件。要开始使用，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是快速启动或开始使用 ElysiaJS 所需的一切。
---

# 快速开始

Elysia 针对 Bun 进行了优化，Bun 是一个 JavaScript 运行时，旨在成为 Node.js 的直接替代品。

你可以使用下面的命令安装 Bun：

```bash
curl https://bun.sh/install | bash
```

## 自动安装

我们建议使用 `bun create elysia` 启动新的 Elysia 服务器，它会自动设置一切。

```bash
bun create elysia app
```

完成后，你应该能在你的目录中看到名为 `app` 的文件夹。

```bash
cd app
```

通过以下方式启动开发服务器：

```bash
bun dev
```

导航到 [localhost:3000](http://localhost:3000) 应该会用 “Hello Elysia” 向你打招呼。

::: tip
Elysia 使用 `dev` 命令为你自动重新加载服务器文件更改。
:::

## 手动安装

要手动创建新的 Elysia 应用程序，请将 Elysia 作为软件包安装：

```typescript
bun add elysia
bun add -d @types/bun
```

这将安装 Elysia 和 Bun 的类型定义。

打开你的 `package.json` 文件并添加以下脚本：

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

这些脚本涉及开发应用程序的不同阶段：

- **dev** - 以开发模式启动 Elysia 并在代码更改时自动重新加载。
- **build** - 构建用于生产的应用程序。
- **start** - 启动 Elysia 生产服务器。

如果使用的是 TypeScript，请确保创建并更新 `tsconfig.json` 以将 `compilerOptions.strict` 设为 `true`：

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 文件结构
如果你没有严格遵守特定的惯例，下面是推荐的 Elysia 文件结构：
- **src** - 任何与开发 Elysia 服务器相关的文件
    - **index.ts** - Elysia 服务器的入口点，设置全局插件的理想位置
    - **setup.ts** - 由各种插件组成，可用作服务定位器
    - **controllers** - 封装多个端点的实例
    - **libs** - 功能函数
    - **models** - Elysia 实例的数据类型对象 (DTO)
    - **types** - 共享 TypeScript 类型 (可选)
- **test** - Elysia 服务器的测试文件
