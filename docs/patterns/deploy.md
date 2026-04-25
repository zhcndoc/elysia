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
本页提供了如何将 Elysia 部署到生产环境的指南。

## 集群模式
Elysia 默认是单线程的。为了利用多核 CPU，我们可以在集群模式下运行 Elysia。

让我们创建一个 **index.ts** 文件，从 **server.ts** 导入我们的主服务器，并根据 CPU 核心数派生多个工作进程。

::: code-group

```ts [src/index.ts]
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

if (cluster.isPrimary) {
  	for (let i = 0; i < os.availableParallelism(); i++)
    	cluster.fork()
} else {
  	await import('./server')
  	console.log(`Worker ${process.pid} started`)
}
```

```ts [src/server.ts]
import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => 'Hello World!')
	.listen(3000)
```

:::

这将确保 Elysia 在多个 CPU 核心上运行。

::: tip
Bun 上的 Elysia 默认使用 SO_REUSEPORT，允许多个实例监听同一个端口。该功能仅在 Linux 上有效。
:::

## 编译为二进制文件
我们推荐在部署到生产环境前运行构建命令，因为这可能显著减少内存使用和文件大小。

我们推荐使用以下命令将 Elysia 编译成单个二进制文件：
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	src/index.ts
```

这将生成一个可移植的二进制文件 `server`，我们可以运行它来启动服务器。

将服务器编译为二进制通常会比开发环境显著减少 2-3 倍的内存使用。

这个命令较长，我们来拆解说明：
1. **--compile** 编译 TypeScript 为二进制
2. **--minify-whitespace** 移除不必要的空白
3. **--minify-syntax** 压缩 JavaScript 语法以减少文件大小
4. **--target bun** 为 Bun 运行时优化二进制
5. **--outfile server** 输出二进制文件为 `server`
6. **src/index.ts** 服务器的入口文件（代码基础）

要启动服务器，只需运行该二进制文件：
```bash
./server
```

一旦二进制文件编译完成，您无需在机器上安装 `Bun` 来运行服务器。

这非常方便，因为部署服务器无需安装额外运行时即可运行，使二进制文件具备可移植性。

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
| 目标                      | 操作系统         | 架构          | 支持现代 | 基线      | Libc  |
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
Bun 有一个 `--minify` 标志可以压缩二进制文件。

但是如果我们使用 [OpenTelemetry](/plugins/opentelemetry)，它会把函数名压缩成单个字符。

这会让追踪比应有的更困难，因为 OpenTelemetry 依赖函数名。

但是，如果您不使用 OpenTelemetry，则可以选择使用 `--minify`：
```bash
bun build \
	--compile \
	--minify \
	--outfile server \
	src/index.ts
```

### 权限
某些 Linux 发行版可能无法运行该二进制文件，建议在 Linux 上为二进制文件启用执行权限：
```bash
chmod +x ./server

./server
```

### 未知的随机中文错误
如果您尝试将二进制文件部署到服务器但无法运行，并出现随机的中文字符错误。

不幸的是，Bun 要求机器必须具备 `AVX2` 硬件支持。

据我们所知，当前没有替代方案。

没有已知的解决办法。

## 编译为 JavaScript
如果您无法编译成二进制，或正在 Windows 服务器上部署。

您可以将服务器打包成单个 JavaScript 文件。

```bash
bun build \
	--minify-whitespace \
	--minify-syntax \
	--outfile ./dist/index.js \
	src/index.ts
```

这将生成一个可以在服务器上部署的单个可移植的 JavaScript 文件。
```bash
NODE_ENV=production bun ./dist/index.js
```

## Docker
在 Docker 上，我们推荐总是编译为二进制以减少基础镜像开销。

下面是一个使用 Distroless 镜像和二进制的示例镜像。
```dockerfile [Dockerfile]
FROM oven/bun AS build

WORKDIR /app

# 缓存依赖安装
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
如果您使用 [OpenTelemetry](/patterns/opentelemetry) 来部署生产服务器。

由于 OpenTelemetry 依赖于猴子补丁 `node_modules/<library>`。为了使框架正常工作，我们需要将要监控的库指定为外部模块，排除它们被打包。

例如，如果您使用 `@opentelemetry/instrumentation-pg` 来监控 `pg` 库。我们需要排除 `pg` 被打包，并确保它在运行时从 `node_modules/pg` 导入。

为此，我们可以使用 `--external pg` 指定 `pg` 作为外部模块：
```bash
bun build --compile --external pg --outfile server src/index.ts
```

这告诉 bun 不将 `pg` 打包进最终输出文件中，运行时会从 `node_modules` 目录导入它。因此在生产服务器上，您必须保留 `node_modules` 目录。

建议在 `package.json` 中将生产服务器需要的包指定为 `dependencies`，并使用 `bun install --production` 仅安装生产依赖。

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysia/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

然后在生产服务器上构建后运行
```bash
bun install --production
```

如果 `node_modules` 目录仍然包含开发依赖，可以删除该目录并重新安装生产依赖。

### Monorepo
如果您在 Monorepo 中使用 Elysia，您可能需要包含依赖的 `packages`。

如果您使用 Turborepo，您可以将 Dockerfile 放置在应用目录，如 **apps/server/Dockerfile**。这同样适用于其他 monorepo 管理工具如 Lerna 等。

假设我们的 monorepo 使用 Turborepo，结构如下：
- apps
	- server
		- **Dockerfile（在此放置 Dockerfile）**
- packages
	- config

然后我们可以在 monorepo 根目录（而非应用目录）构建 Docker 镜像：
```bash
docker build -f apps/server/Dockerfile -t elysia-mono .
```

Dockerfile 如下：
```dockerfile [apps/server/Dockerfile]
FROM oven/bun:1 AS build

WORKDIR /app

# 缓存依赖
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

Railway 为每个部署分配一个 **随机端口**，可通过 `PORT` 环境变量访问。

我们需要修改 Elysia 服务器代码以接受 `PORT` 环境变量，从而兼容 Railway 的端口。

我们可以使用 `process.env.PORT`，并在开发时提供一个默认端口：
```ts
new Elysia()
	.listen(3000) // [!code --]
	.listen(process.env.PORT ?? 3000) // [!code ++]
```

这将允许 Elysia 获取 Railway 提供的端口。

::: tip
Elysia 会自动将主机名指定为 `0.0.0.0`，这可适配 Railway。
:::
