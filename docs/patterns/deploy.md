---
title: 部署到生产环境 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 部署到生产环境 - ElysiaJS

  - - meta
    - name: 'description'
      content: 本页面

  - - meta
    - property: 'og:description'
      content: Elysia 可以通过将对象传递给构造函数来进行配置。我们可以通过将对象传递给构造函数来配置 Elysia 的行为。
---

# 部署到生产环境
本页面是关于如何将 Elysia 部署到生产环境的指南。

## 编译为二进制
我们建议在部署到生产环境之前运行构建命令，因为这可能会显著减少内存使用和文件大小。

我们推荐使用以下命令将 Elysia 编译成单个二进制文件：
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts
```

这将生成一个可移植的二进制文件 `server`，我们可以运行它来启动我们的服务器。

将服务器编译为二进制文件通常相比于开发环境显著降低 2-3 倍的内存使用。

这个命令有点长，我们来拆解一下：
1. **--compile** 将 TypeScript 编译为二进制
2. **--minify-whitespace** 移除不必要的空白
3. **--minify-syntax** 压缩 JavaScript 语法以减小文件大小
4. **--outfile server** 输出二进制文件为 `server`
5. **src/index.ts** 我们服务器的入口文件（代码库）

要启动服务器，只需运行该二进制文件。
```bash
./server
```

一旦二进制文件编译完成，您就不需要在机器上安装 `Bun` 运行服务器。

这非常好，因为部署服务器无需安装额外的运行时即可运行，使二进制文件具有可移植性。

### 目标平台
您也可以添加 `--target` 标志来针对目标平台优化二进制文件。

```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun-linux-x64 \
	--outfile server \
	src/index.ts
```

以下是可用的目标列表：
| Target                  | 操作系统         | 架构          | Modern | Baseline | Libc  |
|--------------------------|------------------|--------------|--------|----------|-------|
| bun-linux-x64           | Linux            | x64          | ✅      | ✅        | glibc |
| bun-linux-arm64         | Linux            | arm64        | ✅      | N/A      | glibc |
| bun-windows-x64         | Windows          | x64          | ✅      | ✅        | -     |
| bun-windows-arm64       | Windows          | arm64        | ❌      | ❌        | -     |
| bun-darwin-x64          | macOS            | x64          | ✅      | ✅        | -     |
| bun-darwin-arm64        | macOS            | arm64        | ✅      | N/A      | -     |
| bun-linux-x64-musl      | Linux            | x64          | ✅      | ✅        | musl  |
| bun-linux-arm64-musl    | Linux            | arm64        | ✅      | N/A      | musl  |

### 为什么不使用 --minify
Bun 确实有 `--minify` 标志，用于压缩二进制文件。

然而，如果我们正在使用 [OpenTelemetry](/plugins/opentelemetry)，它会将函数名缩减为单个字符。

这使得跟踪比预期更困难，因为 OpenTelemetry 依赖于函数名。

但是，如果您不使用 OpenTelemetry，则可以选择使用 `--minify`：
```bash
bun build \
	--compile \
	--minify \
	--outfile server \
	src/index.ts
```

### 权限
一些 Linux 发行版可能无法运行二进制文件，如果您使用的是 Linux，建议为二进制文件启用可执行权限：
```bash
chmod +x ./server

./server
```

### 未知的随机中文错误
如果您尝试将二进制文件部署到服务器但无法运行，并出现随机中文字符错误，这意味着您运行的机器 **不支持 AVX2**。

不幸的是，Bun 要求机器必须具备 `AVX2` 硬件支持。

据我们所知目前无替代方案。

## 编译为 JavaScript
如果您无法编译为二进制文件或您正在 Windows 服务器上进行部署。

您可以将服务器打包为一个 JavaScript 文件。

```bash
bun build \
	--minify-whitespace \
	--minify-syntax \
	--outfile ./dist/index.js \
	src/index.ts
```

这将生成一个可以在服务器上部署的单个可移植 JavaScript 文件。
```bash
NODE_ENV=production bun ./dist/index.js
```

## Docker
在 Docker 上，我们建议始终编译为二进制以减少基础镜像的开销。

以下是使用二进制的 Distroless 镜像的示例。
```dockerfile [Dockerfile]
FROM oven/bun AS build

WORKDIR /app

# 缓存包安装
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

### OpenTelemetry
如果您使用 [OpenTelemetry](/integrations/opentelemetry) 来部署生产服务器。

由于 OpenTelemetry 依赖于猴子补丁 `node_modules/<library>`。为了确保仪器正常工作，我们需要指定供仪器使用的库是外部模块，以将其排除在打包之外。

例如，如果您使用 `@opentelemetry/instrumentation-pg` 以对 `pg` 库进行仪表化，我们需要将 `pg` 排除在打包之外，并确保它从 `node_modules/pg` 导入。

为使这一切正常工作，我们可以使用 `--external pg` 将 `pg` 指定为外部模块：
```bash
bun build --compile --external pg --outfile server src/index.ts
```

这告诉 bun 不将 `pg` 打包到最终输出文件中，并将在运行时从 `node_modules` 目录导入。因此在生产服务器上，您还必须保留 `node_modules` 目录。

建议在 `package.json` 中将应在生产服务器上可用的包指定为 `dependencies`，并使用 `bun install --production` 仅安装生产依赖项。

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysiajs/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

然后，在生产服务器上运行构建命令后
```bash
bun install --production
```

如果 `node_modules` 目录仍包含开发依赖项，您可以删除 `node_modules` 目录并重新安装生产依赖项。

### Monorepo
如果您在 Monorepo 中使用 Elysia，您可能需要包括依赖的 `packages`。

如果您使用 Turborepo，您可以在您的应用程序目录中放置 Dockerfile，例如 **apps/server/Dockerfile**。这也适用于其他 monorepo 管理器，如 Lerna 等。

假设我们的 monorepo 使用 Turborepo，结构如下：
- apps
	- server
		- **Dockerfile（在此处放置 Dockerfile）**
- packages
	- config

然后我们可以在 monorepo 根目录（而不是应用根目录）构建我们的 Dockerfile：
```bash
docker build -t elysia-mono .
```

Dockerfile 如下：
```dockerfile [apps/server/Dockerfile]
FROM oven/bun:1 AS build

WORKDIR /app

# 缓存包
COPY package.json package.json
COPY bun.lock bun.lock

COPY /apps/server/package.json ./apps/server/package.json
COPY /packages/config/package.json ./packages/config/package.json

RUN bun install

COPY /apps/server ./apps/server
COPY /packages/config ./packages/config

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

## Railway
[Railway](https://railway.app) 是一个流行的部署平台。

Railway 为每个部署分配一个 **随机端口**，可以通过 `PORT` 环境变量访问。

我们需要修改我们的 Elysia 服务器，以接受 `PORT` 环境变量，以符合 Railway 端口。

我们可以使用 `process.env.PORT`，并在开发期间提供一个后备端口：
```ts
new Elysia()
	.listen(3000) // [!code --]
	.listen(process.env.PORT ?? 3000) // [!code ++]
```

这应该允许 Elysia 拦截 Railway 提供的端口。

::: tip
Elysia 自动将主机名分配为 `0.0.0.0`，这与 Railway 兼容
:::