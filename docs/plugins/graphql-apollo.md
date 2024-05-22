---
title: Apollo GraphQL Plugin
head:
    - - meta
      - property: 'og:title'
        content: Apollo GraphQL Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using GraphQL Apollo on the Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using GraphQL Apollo on the Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".
---

# GraphQL Apollo Plugin
用于使用 GraphQL Apollo 的 [Elysia](https://github.com/elysiajs/elysia) 插件。

安装方法：
```bash
bun add graphql @elysiajs/apollo @apollo/server
```

使用方法：
```typescript
import { Elysia } from 'elysia'
import { apollo, gql } from '@elysiajs/apollo'

const app = new Elysia()
    .use(
        apollo({
            typeDefs: gql`
                type Book {
                    title: String
                    author: String
                }

                type Query {
                    books: [Book]
                }
            `,
            resolvers: {
                Query: {
                    books: () => {
                        return [
                            {
                                title: 'Elysia',
                                author: 'saltyAom'
                            }
                        ]
                    }
                }
            }
        })
    )
    .listen(3000)
```

访问 `/graphql` 可以看到 Apollo GraphQL playground 的工作情况。

## 上下文
由于 Elysia 基于 Web 标准的请求和响应，与 Express 使用的 Node 的 HttpRequest 和 HttpResponse 不同，导致上下文中的 `req` 和 `res` 未定义。

因此，Elysia 将二者替换为像路由参数一样的 `context`。
```typescript
const app = new Elysia()
    .use(
        apollo({
            typeDefs,
            resolvers,
            context: async ({ request }) => {
                const authorization = request.headers.get('Authorization')

                return {
                    authorization
                }
            }
        })
    )
    .listen(3000)
```

## 配置
该插件扩展了 Apollo 的 [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options) (即 `ApolloServer` 的构造函 ��� 参数)。

以下是用于配置带有 Elysia 的 Apollo Server 的扩展参数。
### path
@default "/graphql"

暴露 Apollo Server 的路径。

### enablePlayground
@default "process.env.ENV !== 'production'

确定是否应提供 Apollo Playground。