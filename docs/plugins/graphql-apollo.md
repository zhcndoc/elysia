---
title: Apollo GraphQL 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Apollo GraphQL 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，用于在 Elysia 服务器上添加对 GraphQL Apollo 的支持。通过 "bun add graphql @elysiajs/apollo @apollo/server" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，用于在 Elysia 服务器上添加对 GraphQL Apollo 的支持。通过 "bun add graphql @elysiajs/apollo @apollo/server" 安装插件。
---

# GraphQL Apollo 插件

用于 [elysia](https://github.com/elysiajs/elysia) 的插件，可以使用 GraphQL Apollo。

使用以下命令安装：

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

访问 `/graphql` 应该会显示 Apollo GraphQL playground 工作情况。

## 背景

由于 Elysia 基于 Web 标准请求和响应，这与 Express 使用的 Node 的 `HttpRequest` 和 `HttpResponse` 不同，导致 `req, res` 在上下文中为未定义。

因此，Elysia 用 `context` 替代两者，类似于路由参数。

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

该插件扩展了 Apollo 的 [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options)（即 `ApolloServer` 的构造参数）。

以下是用于使用 Elysia 配置 Apollo Server 的扩展参数。

### path

@default `"/graphql"`

暴露 Apollo Server 的路径。

### enablePlayground

@default `process.env.ENV !== 'production'`

确定 Apollo 是否应提供 Apollo Playground。