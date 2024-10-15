---
title: Apollo GraphQL 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Apollo GraphQL 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 适用于 Elysia 的插件，增加了在 Elysia 服务器上使用 GraphQL Apollo 的支持。可以通过 "bun add graphql @elysiajs/apollo @apollo/server" 安装该插件。

    - - meta
      - name: 'og:description'
        content: 适用于 Elysia 的插件，增加了在 Elysia 服务器上使用 GraphQL Apollo 的支持。可以通过 "bun add graphql @elysiajs/apollo @apollo/server" 安装该插件。
---

# GraphQL Apollo 插件
适用于 [elysia](https://github.com/elysiajs/elysia) 的 GraphQL Apollo 插件。

通过以下命令安装：
```bash
bun add graphql @elysiajs/apollo @apollo/server
```

然后使用它：
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

访问 `/graphql` 应该可以看到 Apollo GraphQL playground 的工作情况。

## 上下文
因为 Elysia 基于 Web 标准请求和响应，这与 Node 的 `HttpRequest` 和 `HttpResponse`（Express 使用的）不同，导致上下文中的 `req, res` 未定义。

因此，Elysia 用 `context` 替代了这两个参数，就像路由参数一样。
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
这个插件扩展了 Apollo 的 [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options)（这是 `ApolloServer` 的构造参数）。

以下是用于配置 Elysia 上 Apollo 服务器的扩展参数。
### path
@default "/graphql"

暴露 Apollo 服务器的路径。

### enablePlayground
@default "process.env.ENV !== 'production"

决定是否应提供 Apollo Playground。
