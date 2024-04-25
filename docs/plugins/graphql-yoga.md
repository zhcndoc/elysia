---
title: GraphQL Yoga 插件
head:
    - - meta
      - property: 'og:title'
        content: GraphQL Yoga 插件 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 这是一个为 Elysia 添加对 GraphQL Yoga 支持的插件。通过以下命令安装插件："bun add graphql graphql-yoga @elysiajs/graphql-yoga"。

    - - meta
      - name: 'og:description'
        content: 这是一个为 Elysia 添加对 GraphQL Yoga 支持的插件。通过以下命令安装插件："bun add graphql graphql-yoga @elysiajs/graphql-yoga"。
---

# GraphQL Yoga 插件
这个插件将 GraphQL Yoga 集成到 Elysia 中。

安装方式：
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

在浏览器中访问 `/graphql` (GET 请求)，将显示一个支持 GraphQL 的 Elysia 服务器的 GraphiQL 实例。

可选：你也可以安装自定义版本的可选依赖：
```bash
bun add graphql graphql-yoga
```

## 解析器
Elysia 使用 [Mobius](https://github.com/saltyaom/mobius) 来自动从 **typeDefs** 字段推断类型，允许在输入 **resolver** 类型时获得完全的类型安全和自动补全。

## 上下文
通过添加 **context**，你可以向解析器函数添加自定义上下文。
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
            // 如果 context 是一个函数，此项应该省略
            // 由于某种原因，没有它无法推断出上下文类型
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
这个插件扩展了 [GraphQL Yoga 的 createYoga 选项，请参考 GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server/docs)，并将 `schema` 配置内联到根目录。

以下是插件接受的配置

### path
@default `/graphql`

公开 GraphQL 处理程序的路径