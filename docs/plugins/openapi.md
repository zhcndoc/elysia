---
title: OpenAPI 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 适用于 Elysia 的插件，添加支持为 Elysia 服务器生成 Swagger API 文档。开始使用前请先通过 "bun add @elysiajs/swagger" 安装该插件。

    - - meta
      - name: 'og:description'
        content: 适用于 Elysia 的插件，添加支持为 Elysia 服务器生成 Swagger API 文档。开始使用前请先通过 "bun add @elysiajs/swagger" 安装该插件。
---

<script setup lang="ts">
import TutorialBadge from '../components/arona/badge.vue'
</script>

# OpenAPI 插件 <TutorialBadge href="/tutorial/features/openapi" />

为 [elysia](https://github.com/elysiajs/elysia) 提供自动生成 API 文档页面的插件。

安装命令：

```bash
bun add @elysiajs/openapi
```

然后使用该插件：

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi())
    .get('/', () => 'hello')
    .post('/hello', () => 'OpenAPI')
    .listen(3000)
```

访问 `/openapi` 会展示一个 Scalar UI，根据 Elysia 服务器生成的端点文档。你也可以访问 `/openapi/json` 来获取原始的 OpenAPI 规范。

::: tip
此页面为插件配置参考。

如果你正在寻找常见模式或高级用法，请查看 [Patterns: OpenAPI](/patterns/openapi)
:::

## 详情

`detail` 扩展了 [OpenAPI Operation Object](https://spec.openapis.org/oas/v3.0.3.html#operation-object) 规范。

detail 字段是一个对象，用于描述用于 API 文档的路由信息。

它可能包含以下字段：

## detail.hide

你可以通过设置 `detail.hide` 为 `true` 来隐藏该路由，不在 Swagger 页面显示。

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia().use(openapi()).post('/sign-in', ({ body }) => body, {
    body: t.Object(
        {
            username: t.String(),
            password: t.String()
        },
        {
            description: '期望接收用户名和密码'
        }
    ),
    detail: {
        // [!code ++]
        hide: true // [!code ++]
    } // [!code ++]
})
```

### detail.deprecated

声明该操作已被弃用。使用者应避免使用该操作。默认值为 `false`。

### detail.description

对操作行为的详细说明。

### detail.summary

该操作的简短摘要。

## 配置

下面是插件可接受的配置

## enabled

@default true  
启用/禁用该插件

## documentation

OpenAPI 文档信息

@see https://spec.openapis.org/oas/v3.0.3.html

## exclude

配置排除不在文档中的路径或方法

## exclude.methods

排除文档的请求方法列表

## exclude.paths

排除文档的路径列表

## exclude.staticFile

@default true

排除静态文件路由，不生成文档

## exclude.tags

排除文档的标签列表

## mapJsonSchema
从标准 schema 到 OpenAPI schema 的自定义映射函数

### 示例
```typescript
import { openapi } from '@elysiajs/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'

openapi({
	mapJsonSchema: {
	  	valibot: toJsonSchema
  	}
})
```

## path

@default '/openapi'

暴露 OpenAPI 文档前端的端点路径

## provider

@default 'scalar'

OpenAPI 文档前端提供者，支持：

- [Scalar](https://github.com/scalar/scalar)
- [SwaggerUI](https://github.com/swagger-api/swagger-ui)
- null：禁用前端页面

## references

每个端点的额外 OpenAPI 引用配置

## scalar

Scalar 配置，参考 [Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

### 自托管 Scalar 包

自托管 Scalar 包并禁用 CDN 字体。

注意： `cdn` 是 Elysia OpenAPI 插件的选项（不是 Scalar 自身配置），它覆盖 Scalar 包的 URI。

```typescript
    openapi({ 
      scalar: {
        cdn: "/public/scalar-standalone.min.js", // 插件覆盖 Scalar 包的 URI（自托管）
        withDefaultFonts: false, // 禁用 Scalar 的默认字体 CDN
      },
    })
```

## specPath

@default '/${path}/json'

暴露 OpenAPI 规格（JSON 格式）的端点路径

## swagger

Swagger 配置，参考 [Swagger config](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)

下面可以找到使用插件的常见模式。
