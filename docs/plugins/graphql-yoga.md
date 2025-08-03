---
title: GraphQL Yoga 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: GraphQL Yoga 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，添加对在 Elysia 服务器上使用 GraphQL Yoga 的支持。开始可以使用“bun add graphql graphql-yoga @elysiajs/graphql-yoga”安装此插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，添加对在 Elysia 服务器上使用 GraphQL Yoga 的支持。开始可以使用“bun add graphql graphql-yoga @elysiajs/graphql-yoga”安装此插件。
---

# GraphQL Yoga 插件

此插件将 GraphQL Yoga 集成到 Elysia 中

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
			typeDefs: /* GraphQL */ `
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

在浏览器中访问 `/graphql`（GET 请求）将显示一个 GraphiQL 实例，用于支持 GraphQL 的 Elysia 服务器。

可选：您还可以安装自定义版本的可选对等依赖项：

```bash
bun add graphql graphql-yoga
```

## 解析器

Elysia 使用 [Mobius](https://github.com/saltyaom/mobius) 自动从 **typeDefs** 字段推断类型，允许您在输入 **resolver** 类型时获得完全的类型安全和自动完成。

## 上下文

您可以通过添加 **context** 为解析器函数添加自定义上下文

```ts
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

const app = new Elysia()
	.use(
		yoga({
			typeDefs: /* GraphQL */ `
				type Query {
					hi: String
				}
			`,
			context: {
				name: 'Mobius'
			},
			// 如果上下文是一个函数，它不出现在这里
			// 由于某种原因，它不会推断上下文类型
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

此插件扩展了 [GraphQL Yoga 的 createYoga 选项，请参考 GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server/docs)，并将 `schema` 配置内联到根部。

以下是插件接受的配置

### path

@default `/graphql`

公开 GraphQL 处理程序的端点