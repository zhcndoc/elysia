---
title: 与 Cloudflare Worker 集成 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 与 Cloudflare Worker 集成 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 可以通过 Cloudflare Worker 适配器支持预编译（Ahead of Time Compilation）运行在 Cloudflare Worker 上。

  - - meta
    - name: 'og:description'
      content: Elysia 可以通过 Cloudflare Worker 适配器支持预编译（Ahead of Time Compilation）运行在 Cloudflare Worker 上。
---

# Cloudflare Worker <Badge type="warning">实验性</Badge>

Elysia 现在支持通过一个**实验性**的 Cloudflare Worker 适配器运行在 Cloudflare Worker 上。

1. 你需要使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update) 进行设置，并启动开发服务器。

```bash
wrangler init elysia-on-cloudflare
```

2. 接着将 Cloudflare 适配器添加到你的 Elysia 应用，并确保在导出应用前调用 `.compile()`。
```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker' // [!code ++]

export default new Elysia({
	adapter: CloudflareAdapter // [!code ++]
})
	.get('/', () => 'Hello Cloudflare Worker!')
	// 使 Elysia 能在 Cloudflare Worker 上运行所必需
	.compile() // [!code ++]
```

3. 确保在你的 wrangler 配置中将 `compatibility_date` 设置至少为 `2025-06-01`

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01" // [!code ++]
}
```

```toml [wrangler.toml]
main = "src/index.ts"
name = "elysia-on-cloudflare"
compatibility_date = "2025-06-01" # [!code ++]
```

:::

4. 现在你可以通过以下命令启动开发服务器：
```bash
wrangler dev
```

这将启动一个开发服务器，地址为 `http://localhost:8787`

你不需要 `nodejs_compat` 标志，因为 Elysia 不使用任何 Node.js 内置模块（或者说我们使用的模块还不支持 Cloudflare Worker）。

### pnpm
如果你使用 pnpm，[pnpm 默认不会自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，需要你手动安装额外依赖。
```bash
pnpm add @sinclair/typebox openapi-types
```

## 限制
以下是在 Cloudflare Worker 上使用 Elysia 的一些已知限制：

1. `Elysia.file` 和 [静态插件](/plugins/static) 不可用，[因为缺少 `fs` 模块支持](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)，详见[静态文件](#static-file)部分的替代方案
2. [OpenAPI 类型生成](/blog/openapi-type-gen) 不可用，[因为缺少 `fs` 模块支持](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)
3. 你不能在服务器启动前定义[**Response**](https://x.com/saltyAom/status/1966602691754553832)，也不能使用会这样做的插件
4. 由于第 3 点，你不能内联一个值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	// 这会抛出错误
    .get('/', 'Hello Elysia')
    .listen(3000)
```

## 静态文件
[静态插件](/plugins/static) 不可用，但你仍然可以使用 [Cloudflare 内置的静态文件服务](https://developers.cloudflare.com/workers/static-assets/) 来提供静态文件。

在你的 wrangler 配置中添加以下内容：

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01",
	"assets": { "directory": "public" } // [!code ++]
}
```

```toml [wrangler.toml]
name = "elysia-on-cloudflare"
main = "src/index.ts"
compatibility_date = "2025-06-01"
assets = { directory = "public" } # [!code ++]
```

:::

创建一个 `public` 文件夹并将你的静态文件放入其中。

例如，你有如下文件夹结构：
```
│
├─ public
│  ├─ kyuukurarin.mp4
│  └─ static
│     └─ mika.webp
├─ src
│  └── index.ts
└─ wrangler.toml
```

那么你应该能通过以下路径访问静态文件：
- **http://localhost:8787/kyuukurarin.mp4**
- **http://localhost:8787/static/mika.webp**

## 绑定
通过从 `cloudflare:workers` 导入 env，你可以使用 Cloudflare Workers 绑定。

```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import { env } from 'cloudflare:workers' // [!code ++]

export default new Elysia({
	adapter: CloudflareAdapter
})
	.get('/', () => `Hello ${await env.KV.get('my-key')}`) // [!code ++]
	.compile()
```

更多绑定信息请参阅 [Cloudflare Workers: Binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global)。

## 预编译（AoT）编译
此前，在 Cloudflare Worker 上使用 Elysia 时，你需要给 Elysia 构造函数传入 `aot: false`。

这现在已不再必要，[因为 Cloudflare 现在支持启动期间的函数编译](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-eval-during-startup)。

从 Elysia 1.4.7 版本起，你可以在 Cloudflare Worker 上启用预编译（Ahead of Time Compilation），并且可以去掉 `aot: false` 选项。

```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker' // [!code ++]

export default new Elysia({
	aot: false, // [!code --]
	adapter: CloudflareAdapter // [!code ++]
})
```

当然，如果你不想使用预编译，仍然可以使用 `aot: false`，但我们推荐启用以获得更好的性能和更准确的插件封装。