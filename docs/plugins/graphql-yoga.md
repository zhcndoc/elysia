---
title: GraphQL Yoga 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: GraphQL Yoga 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 提供 GraphQL Yoga 支持的插件。通过使用 "bun add graphql graphql-yoga @elysiajs/graphql-yoga" 安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 提供 GraphQL Yoga 支持的插件。通过使用 "bun add graphql graphql-yoga @elysiajs/graphql-yoga" 安装插件。
---

# GraphQL Yoga 插件
此插件将 GraphQL Yoga 与 Elysia 集成

安装方法：
```bash
bun add @elysiajs/graphql-yoga
```

然后使用它：
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

在浏览器中访问 `/graphql`（GET 请求）将向您展示一个为启用 GraphQL 的 Elysia 服务器提供的 GraphiQL 实例。

可选：您还可以安装自定义版本的可选对等依赖：
```bash
bun add graphql graphql-yoga
```

## 解析器
Elysia 使用 [Mobius](https://github.com/saltyaom/mobius) 自动推断 **typeDefs** 字段的类型，让您在输入 **resolver** 类型时获得完全的类型安全和自动补全。

## 上下文
您可以通过添加 **context** 来向解析函数添加自定义上下文：
```ts
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
            context: {
                name: 'Mobius'
            },
            // 如果上下文是一个函数，并且出于某种原因没有提供
            // 系统将不会推断上下文类型
            useContext(_) {},
            resolvers: {
                Query: {
                    hi: async (parent, args, context) => context.name
                }
            }
        })
    )
    .listen(3000)
```

## 配置
此插件扩展了 [GraphQL Yoga 的 createYoga 选项，请参考 GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server/docs)，并将 `schema` 配置行内嵌入根部。

以下是插件接受的配置

### path
@default `/graphql`

用于暴露 GraphQL 处理程序的端点
