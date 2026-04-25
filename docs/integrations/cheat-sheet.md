---
title: 速查表 (通过示例了解 Elysia) - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 速查表 (通过示例了解 Elysia) - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的速查表摘要及其如何通过“Elysia by example”运行

  - - meta
    - property: 'og:description'
      content: Elysia 的速查表摘要及其如何通过“Elysia by example”运行
---

# 速查表
这里是常见 Elysia 模式的快速概览

## Hello World
一个简单的 hello world

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .listen(3000)
```

## Custom HTTP Method
使用自定义 HTTP 方法/动词定义路由

参见 [路由](/essential/route.html#custom-method)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', '/hi', () => 'Custom Method')
    .listen(3000)
```

## Path Parameter
使用动态路径参数

参见 [路径](/essential/route.html#path-type)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(3000)
```

## 返回 JSON
Elysia 会自动将响应转换为 JSON

参见 [处理器](/essential/handler.html)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia'
        }
    })
    .listen(3000)
```

## 返回文件
文件可以作为 formdata 响应返回

响应必须是 1 级深度对象

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia',
            image: file('public/cat.jpg')
        }
    })
    .listen(3000)
```

## 头部和状态
设置自定义头部和状态码

参见 [处理器](/essential/handler.html)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set, status }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return status(418, "I'm a teapot")
    })
    .listen(3000)
```

## Group
为子路由定义一次性前缀

参见 [组](/essential/route.html#group)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get("/", () => "Hi")
    .group("/auth", app => {
        return app
            .get("/", () => "Hi")
            .post("/sign-in", ({ body }) => body)
            .put("/sign-up", ({ body }) => body)
    })
    .listen(3000)
```

## Schema
强制路由的数据类型

参见 [验证](/essential/validation)

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/mirror', ({ body: { username } }) => username, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(3000)
```

## 文件上传
请参见 [验证#文件](/essential/validation#file)

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
		body: t.Object({
			file: t.File({ format: 'image/*' }),
			multipleFiles: t.Files()
		})
	})
	.listen(3000)
```

## Lifecycle Hook
按顺序拦截 Elysia 事件

参见 [生命周期](/essential/life-cycle.html)

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onRequest(() => {
        console.log('请求时')
    })
    .on('beforeHandle', () => {
        console.log('处理前')
    })
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        afterHandle: () => {
            console.log("处理后")
        }
    })
    .listen(3000)
```

## Guard
对子路由强制数据类型

参见 [范围](/essential/plugin.html#scope)

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        response: t.String()
    }, (app) => app
        .get('/', () => 'Hi')
        // 无效: 会抛出错误，并且 TypeScript 会报告错误
        .get('/invalid', () => 1)
    )
    .listen(3000)
```

## 自定义上下文
为路由上下文添加自定义变量

参见 [上下文](/essential/handler.html#context)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({
        getDate,
        store: { version }
    }) => `${version} ${getDate()}`)
    .listen(3000)
```

## 重定向
重定向响应

参见 [处理器](/essential/handler.html#redirect)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ redirect }) => {
        return redirect('/')
    })
    .listen(3000)
```

## 插件
创建一个单独的实例

参见 [插件](/essential/plugin)

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .state('plugin-version', 1)
    .get('/hi', () => 'hi')

new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(3000)
```

## WebSocket
使用 WebSocket 创建实时连接

参见 [Web Socket](/patterns/websocket)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ping', {
        message(ws, message) {
            ws.send('hello ' + message)
        }
    })
    .listen(3000)
```

## OpenAPI 文档
使用 Scalar（或可选的 Swagger）创建交互式文档

参见 [openapi](/plugins/openapi.html)

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysia/openapi'

const app = new Elysia()
    .use(openapi())
    .listen(3000)

console.log(`在浏览器中访问 "${app.server!.url}openapi" 查看文档`);
```

## 单元测试
为你的 Elysia 应用编写单元测试

参见 [单元测试](/patterns/unit-test)

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('返回响应', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

## 自定义 body 解析器
创建自定义的请求体解析逻辑

参见 [解析](/essential/life-cycle.html#parse)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

## GraphQL
使用 GraphQL Yoga 或 Apollo 创建自定义 GraphQL 服务器

参见 [GraphQL Yoga](/plugins/graphql-yoga)

```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysia/graphql-yoga'

const app = new Elysia()
    .use(
        yoga({
            typeDefs: /* GraphQL */`
                type Query {
                    hi: String
                }
            `,
            resolvers: {
                Query: {
                    hi: () => 'Hello from Elysia'
                }
            }
        })
    )
    .listen(3000)
```
