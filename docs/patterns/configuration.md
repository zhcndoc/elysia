---
title: 配置 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 配置 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 可以通过将对象传递给构造函数来进行配置。我们可以通过将对象传递给构造函数来配置 Elysia 的行为。

  - - meta
    - property: 'og:description'
      content: Elysia 可以通过将对象传递给构造函数来进行配置。我们可以通过将对象传递给构造函数来配置 Elysia 的行为。
---

# 配置

我们可以通过将对象传递给构造函数来配置 Elysia 的行为。

```ts
import { Elysia } from 'elysia'

new Elysia({
	prefix: '/group'
})
```

以上是将 Elysia 配置为使用 `/group` 作为路径前缀的示例。

## 最大请求体大小
我们可以通过在 `serve` 配置中设置 [`serve.maxRequestBodySize`](#maxrequestbodysize) 来设置最大请求体大小。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}
})
```

默认情况下，最大请求体大小为 128MB (1024 * 1024 * 128)。

## TLS
我们可以通过传入 key 和 cert 的值来启用 TLS（被称为 SSL 的继任者）；这两个值都是启用 TLS 所必需的。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: Bun.file('cert.pem'),
			key: Bun.file('key.pem')
		}
	}
})
```

Elysia 扩展了 Bun 配置，开箱即用地支持 TLS，基于 BoringSSL。

参见 [TLS 选项](#tls-options) 以获取可用配置。

## 配置项
以下是 Elysia 接受的配置项：

### prefix
@默认 `""`

实例的路径前缀

### name
用于调试和插件去重目的的实例名称

### seed
用于生成 [插件去重](/essential/plugin.html#plugin-deduplication) 的校验和的种子

### detail
用于文档生成的 OpenAPI 文档

该配置扩展了 [Swagger 规范](https://swagger.io/specification)。

@见 [Swagger 规范](https://swagger.io/specification)

### tags
用于文档生成的 OpenAPI 标签

为所有实例路由装饰标签

该配置扩展了 [标签对象](https://swagger.io/specification/#tag-object)

@见 [标签对象](https://swagger.io/specification/#tag-object)

### precompile
@默认 `false`

在启动服务器之前预热 Elysia

这将执行提前编译并生成路由处理程序的代码

如果设置为 false，Elysia 将执行即时编译

仅根实例（使用 listen 的实例）需要生效

### aot
@默认 `false`

提前编译

降低性能但加快启动时间

## strictPath
@默认 `false`

Elysia 是否应该容忍后缀 `/` 或反之亦然

#### 示例
如果将 `strictPath` 设置为 `true`，Elysia 将匹配 `/id` 而不匹配 `/id/`

```ts
import { Elysia } from 'elysia'

new Elysia({
	strictPath: true
})
	.get('/id', 'work')
```

通常，`/id` 和 `/id/` 都会匹配路由处理程序（默认值为 `false`）

## cookie
设置默认的 cookie 选项

## normalize
@默认 `true`

如果启用，处理程序将在传入和传出请求体上运行 [clean](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#clean)，而不是直接失败。

这允许在请求体中发送未知或不允许的属性。这些属性将被过滤掉，而不会导致请求失败。

当模式允许附加属性时，这不会产生影响。

由于这是使用动态模式，因此可能会对性能产生影响。

## nativeStaticResponse
@默认 `true`
@自 1.1.11 起

启用 Bun 静态响应。

Elysia 是否应该使用 Bun 的静态响应。

这可以提高静态内容的性能，并显著减少内存使用。

#### 示例
Elysia 将为静态内容使用 Bun 的静态响应
```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/static', 'work')
```

以上等价于：
```ts
Bun.serve({
	static: {
		'static': 'work',
		'/static': '/work'
	}
})
```

::: tip
此配置仅在使用 Bun > 1.1.27 作为服务器时生效
:::

## websocket
重写 websocket 配置

建议保留此配置为默认，因为 Elysia 会自动生成适合处理 WebSocket 的配置

该配置扩展了 [Bun WebSocket API](https://bun.sh/docs/api/websockets)

## serve
Bun 服务器配置。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		hostname: 'elysiajs.com',
		tls: {
			cert: Bun.file('cert.pem'),
			key: Bun.file('key.pem')
		}
	},
})
```

该配置扩展了 [Bun Serve API](https://bun.sh/docs/api/http) 和 [Bun TLS](https://bun.sh/docs/api/http#tls)

以下内容来自 Bun JSDoc 和 Bun 文档：

### port
@默认 `3000`

监听的端口

### unix
如果设置，将使 HTTP 服务器监听在 unix 套接字而不是端口。

（不能与 hostname + port 一起使用）

### hostname
@默认 `0.0.0.0`

服务器应监听的主机名

### maxRequestBodySize
@默认 `1024 * 1024 * 128` (128MB)

请求体的最大大小？（以字节为单位）

### reusePort
@默认 `true`

是否应设置 `SO_REUSEPORT` 标志

这允许多个进程绑定到同一端口，这对负载均衡很有用

该配置被覆盖，并默认由 Elysia 打开

### id
使用 ID 唯一标识服务器实例

此字符串将用于热重载服务器，而不会中断挂起的请求或 WebSocket。如果未提供，将生成一个值。要禁用热重载，请将此值设置为 `null`。

### rejectUnauthorized
@默认 `NODE_TLS_REJECT_UNAUTHORIZED` 环境变量

如果设置为 `false`，任何证书都将被接受。

## TLS 选项
该配置扩展了 [Bun TLS API](https://bun.sh/docs/api/http#tls)

```ts
import { Elysia } from 'elysia'

new Elysia({
	tls: {
		cert: Bun.file('cert.pem'),
		key: Bun.file('key.pem')
	}
})
```

### cert
PEM 格式的证书链。每个私钥应提供一个证书链。

每个证书链应由为提供的私钥格式化的 PEM 证书组成，后面跟着 PEM 格式的中间证书（如果有），
以顺序排列，且不包括根 CA（根 CA 必须预先为对等方所知，参见 ca）。

提供多个证书链时，它们不必与其在 key 中的私钥的顺序相同。

如果未提供中间证书，
对等方将无法验证证书，握手将失败。

### key
PEM 格式的私钥。PEM 允许对私钥进行加密。加密密钥将使用 options.passphrase 解密。

可以提供使用不同算法的多个密钥，可以是未加密的密钥字符串或缓冲区的数组，或者以对象形式的数组。

对象形式只能在数组中出现。

**object.passphrase** 是可选的。加密密钥将使用提供的 object.passphrase 解密，

**object.passphrase** 如果提供，或 **options.passphrase** 如果未提供。

### ca
可选覆盖受信任的 CA 证书。默认情况下信任 Mozilla 精心挑选的知名 CA。

当明确指定 CA 时，Mozilla 的 CA 会被完全替换。

### passphrase
单个私钥和/或 PFX 的共享密码。

### dhParamsFile
自定义 Diffie Hellman 参数的 .pem 文件路径

### requestCert
@默认 `false`

如果设置为 `true`，服务器将请求客户端证书。

### secureOptions
可选影响 OpenSSL 协议行为，通常不是必需的。

应谨慎使用！

值是 OpenSSL 可选选项的 SSL_OP_* 的数字位掩码

### serverName
显式设置服务器名称

### lowMemoryMode
@默认 `false`

这将 `OPENSSL_RELEASE_BUFFERS` 设置为 1。

它会降低整体性能但节省部分内存。
