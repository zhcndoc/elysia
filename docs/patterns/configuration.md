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

Elysia 提供了可配置的行为，允许我们自定义其功能的各个方面。

我们可以通过使用构造函数定义配置。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1',
	normalize: true
})
```

## 适配器

###### 自 1.1.11 起

用于在不同环境中使用 Elysia 的运行时适配器。

默认适配器会根据环境选择。

```ts
import { Elysia, t } from 'elysia'
import { BunAdapter } from 'elysia/adapter/bun'

new Elysia({
	adapter: BunAdapter
})
```

## AOT

###### 自 0.4.0 起

提前编译（Ahead of Time compilation）。

Elysia 内置了一个 JIT _"编译器"_，可以[优化性能](/blog/elysia-04.html#ahead-of-time-complie)。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	aot: true
})
```

禁用提前编译

#### 选项 - @default `false`

- `true` - 在启动服务器之前预编译每个路由

- `false` - 完全禁用 JIT。启动时间更快，而不影响性能

## 详细信息

为实例的所有路由定义 OpenAPI 方案。

此方案将用于生成实例所有路由的 OpenAPI 文档。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	detail: {
		hide: true,
		tags: ['elysia']
	}
})
```

## encodeSchema

处理自定义 `t.Transform` 模式的自定义 `Encode`，在将响应返回给客户端之前进行处理。

这允许我们在发送响应到客户端之前为数据创建自定义编码函数。

```ts
import { Elysia, t } from 'elysia'

new Elysia({ encodeSchema: true })
```

#### 选项 - @default `true`

- `true` - 在将响应发送给客户端之前运行 `Encode`
- `false` - 完全跳过 `Encode`

## name

定义实例名称，用于调试和 [插件去重](/essential/plugin.html#plugin-deduplication)

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	name: 'service.thing'
})
```

## nativeStaticResponse
###### 自 1.1.11 起

为每个相应的运行时使用优化的函数处理内联值。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	nativeStaticResponse: true
})
```

#### 示例

如果在 Bun 上启用，Elysia 将内联值插入到 `Bun.serve.static` 中，从而提高静态值的性能。

```ts
import { Elysia } from 'elysia'

// 这是
new Elysia({
	nativeStaticResponse: true
}).get('/version', 1)

// 相当于
Bun.serve({
	static: {
		'/version': new Response(1)
	}
})
```

## 规范化

###### 自 1.1.0 起

Elysia 是否应该将字段强制转换为指定的模式。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	normalize: true
})
```

当在输入和输出中发现不在模式中规定的未知属性时，Elysia 应该如何处理字段？

选项 - @default `true`

- `true`: Elysia 将使用 [exact mirror](/blog/elysia-13.html#exact-mirror) 将字段强制转换为指定模式

- `typebox`: Elysia 将使用 [TypeBox's Value.Clean](https://github.com/sinclairzx81/typebox) 将字段强制转换为指定模式

- `false`: 如果请求或响应包含不在各自处理程序的模式中明确允许的字段，Elysia 将引发错误。

## 预编译

###### 自 1.0.0 起

Elysia 是否应该在启动服务器之前[预编译所有路由](/blog/elysia-10.html#improved-startup-time)。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	precompile: true
})
```

选项 - @default `false`

- `true`: 在启动服务器之前对所有路由进行 JIT 编译

- `false`: 动态按需编译路由

推荐将其保持为 `false`。

## 前缀

定义实例所有路由的前缀

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1'
})
```

当定义前缀时，所有路由将以给定值为前缀。

#### 示例

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ prefix: '/v1' }).get('/name', 'elysia') // Path is /v1/name
```

## santize

一个函数或一个函数数组，在每个 `t.String` 验证时调用并拦截。

允许我们读取并将字符串转换为新值。

```ts
import { Elysia, t } from 'elysia'

new Elysia({
	santize: (value) => Bun.escapeHTML(value)
})
```

## 种子

定义一个值，用于生成实例的校验和，用于[插件去重](/essential/plugin.html#plugin-deduplication)

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	seed: {
		value: 'service.thing'
	}
})
```

该值可以是任何类型，不限于字符串、数字或对象。

## 严格路径

Elysia 是否应该严格处理路径。

根据[RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3)，路径应与路由中定义的路径完全相等。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ strictPath: true })
```

#### 选项 - @default `false`

- `true` - 严格遵循[RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3) 进行路径匹配
- `false` - 容忍后缀 '/' 或反之亦然。

#### 示例

```ts twoslash
import { Elysia, t } from 'elysia'

// 路径可以是 /name 或 /name/
new Elysia({ strictPath: false }).get('/name', 'elysia')

// 路径只能是 /name
new Elysia({ strictPath: true }).get('/name', 'elysia')
```

## 服务

自定义 HTTP 服务器行为。

Bun 服务配置。

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

该配置扩展了[Bun Serve API](https://bun.sh/docs/api/http)和[Bun TLS](https://bun.sh/docs/api/http#tls)

### 示例: 最大主体大小
我们可以通过在 `serve` 配置中设置[`serve.maxRequestBodySize`](#serve-maxrequestbodysize)来设置最大主体大小。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}
})
```

默认情况下，最大请求体大小为 128MB (1024 * 1024 * 128)。
定义主体大小限制。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// 最大消息大小（以字节为单位）
	    maxPayloadLength: 64 * 1024,
	}
})
```

### 示例: HTTPS / TLS
通过传入密钥和证书的值，我们可以启用 TLS（SSL 的继任者）；两者均为启用 TLS 所必需。

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

### 示例：增加超时

我们可以通过在 `serve` 配置中设置 [`serve.idleTimeout`](#serve-idletimeout) 来增加空闲超时。

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// Increase idle timeout to 30 seconds
		idleTimeout: 30
	}
})
```

默认情况下，空闲超时时间为 10 秒（在 Bun 上）。

---

## serve

HTTP 服务器配置。

Elysia 扩展了 Bun 配置，开箱即用地支持 TLS，基于 BoringSSL。

有关可用配置，请参见 [serve.tls](#serve-tls)。

### serve.hostname
@default `0.0.0.0`

服务器应监听的主机名。

### serve.id
Uniquely identify a server instance with an ID

This string will be used to hot reload the server without interrupting pending requests or websockets. If not provided, a value will be generated. To disable hot reloading, set this value to `null`.

### serve.idleTimeout
@default `10` (10 seconds)

By default, Bun set idle timeout to 10 seconds, which means that if a request is not completed within 10 seconds, it will be aborted.

### serve.maxRequestBodySize
@default `1024 * 1024 * 128` (128MB)

请求体的最大大小？（以字节为单位）

### serve.port
@default `3000`

监听的端口。

### serve.rejectUnauthorized
@default `NODE_TLS_REJECT_UNAUTHORIZED` 环境变量

如果设置为 `false`，将接受任何证书。

### serve.reusePort
@default `true`

是否应设置 `SO_REUSEPORT` 标志。

这允许多个进程绑定到同一端口，对负载均衡很有用。

该配置被覆盖，并默认由 Elysia 打开。

### serve.unix
如果设置，HTTP 服务器将在 Unix 套接字上监听，而不是在端口上。

（不能与主机名+端口一起使用）

### serve.tls
我们可以通过传入密钥和证书的值启用 TLS（SSL 的继任者）；这两者都是启用 TLS 所必需的。

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

Elysia 扩展了支持 TLS 的 Bun 配置，使用 BoringSSL 作为支持。

### serve.tls.ca
可选覆盖受信任的 CA 证书。默认是信任 Mozilla 精心挑选的知名 CA。

当使用此选项明确指定 CA 时，Mozilla 的 CA 会完全被替换。

### serve.tls.cert
PEM 格式的证书链。每个私钥应提供一条证书链。

每条证书链应包含为提供的私钥格式化的 PEM 证书，以及 PEM 格式的中间证书（如果有），按顺序排列，不包括根 CA（根 CA 必须提前为对等方所知，参见 ca）。

提供多个证书链时，顺序不必与其在密钥中的私钥顺序相同。

如果未提供中间证书，对等方将无法验证证书，握手将失败。

### serve.tls.dhParamsFile
自定义 Diffie Helman 参数的 .pem 文件路径。

### serve.tls.key
PEM 格式的私钥。PEM 允许加密私钥的选项。加密密钥将使用 options.passphrase 解密。

可以提供使用不同算法的多个密钥，可以是未加密的密钥字符串或缓冲区的数组，或者以对象形式的数组。

对象形式只能在数组中出现。

**object.passphrase** 是可选的。加密密钥将使用提供的 object.passphrase 解密，

**object.passphrase** 如果提供，或 **options.passphrase** 如果未提供。

### serve.tls.lowMemoryMode
@default `false`

将 `OPENSSL_RELEASE_BUFFERS` 设置为 1。

这会降低整体性能，但节省一些内存。

### serve.tls.passphrase
用于单个私钥和/或 PFX 的共享密码短语。

### serve.tls.requestCert
@default `false`

如果设置为 `true`，服务器将请求客户端证书。

### serve.tls.secureOptions
可选影响 OpenSSL 协议行为，这通常不是必需的。

应谨慎使用！

值是 OpenSSL 可选选项的 SSL_OP_* 的数字位掩码。

### serve.tls.serverName
显式设置服务器名称。

## 标签

为实例的所有路由定义 OpenAPI 方案的标签，类似于[详细信息](#detail)。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	tags: ['elysia']
})
```

### systemRouter

在可能的情况下使用运行时/框架提供的路由器。

在 Bun 上，Elysia 将使用 [Bun.serve.routes](https://bun.sh/docs/api/http#routing) 并回退到 Elysia 自己的路由器。

## websocket

覆盖 websocket 配置

建议将其保持为默认值，因为 Elysia 将自动生成适合处理 WebSocket 的配置

该配置扩展了 [Bun's WebSocket API](https://bun.sh/docs/api/websockets)

#### 示例
```ts
import { Elysia } from 'elysia'

new Elysia({
	websocket: {
		// 启用压缩和解压缩
    	perMessageDeflate: true
	}
})
```

---

<!-- <br />

# 试验性

尝试一个实验性功能，可能会在未来版本的 Elysia 中可用。 -->