---
title: 速查表 - ElysiaJS 
head:
  - - meta
    - property: 'og:title'
      content: 速查表 - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Elysia 的速查表总结以及它如何与 "Elysia 示例" 一起工作

  - - meta
    - property: 'og:description'
      content: Elysia 的速查表总结以及它如何与 "Elysia 示例" 一起工作
---

# 速查表
这里是一些常见 Elysia 模式的快速概览

## Hello World
一个简单的 hello world

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .listen(3000)
```

## 自定义 HTTP 方法
使用自定义 HTTP 方法/动词定义路由

查看 [Route](/essential/route.html#custom-method)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', '/hi', () => '自定义方法')
    .listen(3000)
```

## 路径参数
使用动态路径参数

查看 [Path](/essential/path.html)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(3000)
```

## 返回 JSON
Elysia 自动将响应转换为 JSON

查看 [Handler](/essential/handler.html)

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
文件可以以 formdata 响应的形式返回

响应必须是一个 1 级深度的对象

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia',
            image: Bun.file('public/cat.jpg')
        }
    })
    .listen(3000)
```

## 头部和状态
设置自定义头部和状态码

查看 [Handler](/essential/handler.html)

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set, error }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return error(418, "I'm teapod")
    })
    .listen(3000)
```

## 分组
为子路由一次定义前缀

查看 [Group](/patterns/group.html)

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

查看 [Schema](/essential/schema.html)

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

## 生命周期钩子
按顺序拦截 Elysia 事件

查看 [Lifecycle](/essential/life-cycle.html)

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

## 守卫
强制子路由的数据类型

查看 [Scope](/essential/scope.html#guard)

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        response: t.String()
    }, (app) => app
        .get('/', () => 'Hi')
        // 无效：将抛出错误，并且 TypeScript 将报告错误
        .get('/invalid', () => 1)
    )
    .listen(3000)
```

## 自定义上下文
向路由上下文添加自定义变量

查看 [Context](/essential/context.html)

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

查看 [Handler](/essential/handler.html#redirect)

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

查看 [Plugin](/essential/plugin)

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

## Web Socket
使用 Web Socket 创建实时连接

查看 [Web Socket](/patterns/websocket)

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
使用 Scalar (或可选的 Swagger) 创建交互式文档

查看 [Documentation](/patterns/openapi)

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .listen(3000)

console.log(`View documentation at "${app.server!.url}swagger" in your browser`);
```

## 单元测试
编写你的 Elysia 应用的单元测试

查看 [Unit Test](/patterns/unit-test)

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
创建解析 body 的自定义逻辑

查看 [Parse](/life-cycle/parse.html)

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

查看 [GraphQL Yoga](/plugins/graphql-yoga)

```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

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
