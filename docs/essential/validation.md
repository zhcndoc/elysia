---
title: 验证
head:
    - - meta
      - property: 'og:title'
        content: 验证 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 模式是严格类型的定义，用于推断 TypeScript 的类型和传入请求以及传出响应的数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，这是一个用于数据验证的 TypeScript 库。

    - - meta
      - property: 'og:description'
        content: 模式是严格类型的定义，用于推断 TypeScript 的类型和传入请求以及传出响应的数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，这是一个用于数据验证的 TypeScript 库。
---

<script setup>
import { Elysia, t, ValidationError } from 'elysia'

import Playground from '../../components/nearl/playground.vue'
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'

const demo1 = new Elysia()
    .get('/none', () => 'hi')
    .guard({
        query: t.Object({
            name: t.String()
        })
    })
    .get('/query', ({ query: { name } }) => name)

const demo2 = new Elysia()
    .get('/id/1', '1')
    .get('/id/a', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric()
            }),
            {
                id: 'a'
            }
        )
    })
</script>

# 验证

创建 API 服务器的目的是接收输入并处理它。

JavaScript 允许任何数据具有任何类型。Elysia 提供了一个工具，可以验证数据是否符合正确的格式，以确保数据的有效性。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

### TypeBox

**Elysia.t** 是基于 [TypeBox](https://github.com/sinclairzx81/typebox) 的模式生成器，它提供运行时和编译时的类型安全性，以及生成 OpenAPI/Swagger 文档的 OpenAPI 模式。

TypeBox 是一个非常快速、轻量级和类型安全的 TypeScript 运行时验证库。Elysia 扩展并自定义了 TypeBox 的默认行为，以适应服务器端验证。

我们认为，这样的集成应该默认情况下照顾到框架，而不是依赖于用户在每个项目上设置自定义类型。

## 模式类型
Elysia 支持使用以下类型的声明性模式：

<Deck>
    <Card title="Body" href="#body">
        验证传入的 HTTP 消息
    </Card>
    <Card title="Query" href="#query">
        查询字符串或 URL 参数
    </Card>
    <Card title="Params" href="#params">
        路径参数
    </Card>
    <Card title="Headers" href="#headers">
        请求头
    </Card>
    <Card title="Cookie" href="#cookie">
        请求的 Cookie
    </Card>
    <Card title="Response" href="#response">
        响应结果
    </Card>
</Deck>

---

这些属性应该作为路由处理程序的第三个参数提供，以验证传入的请求。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', () => 'Hello World!', {
        query: t.Object({
            name: t.String()
        }),
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

响应结果应该如下所示：
| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

当提供了模式时，类型将自动从模式中推断出来，并生成一个 OpenAPI 类型，用于生成 Swagger 文档，省去了手动提供类型的冗余任务。

## Body
传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) 是发送给服务器的数据。它可以是 JSON、form-data 或其他格式。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?




		body: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

验证结果应如下所示：
| Body | 验证结果 |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

默认情况下，Elysia 对 **GET** 和 **HEAD** 消息禁用了 body-parser，遵循 HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3) 的规范。

> 如果请求方法不包含对实体主体定义的语义，那么处理请求时应该忽略消息主体。

大多数浏览器默认禁用 **GET** 和 **HEAD** 方法的请求体附加。

### 规范
验证传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)（或 body）。

这些消息是用于让 web 服务器处理的附加消息。

body 被提供，格式同 `fetch` API 中的 `body`。应相应地设置内容类型以匹配定义的 body。

```typescript
fetch('https://elysiajs.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Elysia'
    })
})
```

### 文件
文件是一种特殊类型的 body，可用于上传文件。
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?





		body: t.Object({
			file: t.File(),
			multipleFiles: t.Files()
		})
	})
	.listen(3000)
```

通过提供文件类型，Elysia 会自动假定内容类型为 `multipart/form-data`。

## Query
查询是通过 URL 传递的数据。它可以是 `?key=value` 的形式。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/query', ({ query }) => query, {
                    // ^?




		query: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

查询必须以对象的形式提供。

验证结果应如下所示：
| Query | 验证结果 |
| ---- | --------- |
| /?name=Elysia | ✅ |
| /?name=1 | ✅ |
| /?alias=Elysia | ❌ |
| /?name=ElysiaJS&alias=Elysia | ✅ |
| / | ❌ |

### 规范

查询字符串是 URL 的一部分，以 **?** 开头，可以包含一个或多个查询参数，这些参数是用于向服务器传递附加信息的键值对，通常用于自定义行为，比如过滤或搜索。

![URL 对象](/essential/url-object.svg)

查询在 Fetch API 中的位置是在 **?** 之后。

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

在指定查询参数时，重要的是要了解所有查询参数的值必须表示为字符串。这是因为它们的编码方式以及追加到 URL 的方式。

## Params
路径参数或路由参数是通过 URL 路径传递的数据。

它可以是 `/key` 的形式。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params, {
                      // ^?




		params: t.Object({
			id: t.Number()
		})
	})
```

<Playground :elysia="demo2" />

路径参数必须以对象的形式提供。

验证结果应如下所示：
| URL | 验证结果 |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

### 规范
路径参数 <small>（与查询字符串或查询参数不要混淆）</small>。

**通常情况下，Elysia 可以根据路径参数自动推断类型**，除非需要特定值模式，例如数字值或模板文字模式。

```typescript
fetch('https://elysiajs.com/id/1')
```

### Params 类型推断
如果没有提供参数模式，Elysia 将自动将类型推断为字符串。
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## Headers
请求头是通过请求的头部传递的信息。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/headers', ({ headers }) => headers, {
                      // ^?




		headers: t.Object({
			authorization: t.String()
		})
	})
```

与其他类型不同，请求头的 `additionalProperties` 默认设置为 `true`。

这意味着请求头可以有任意键值对，但值必须符合模式。

### 规范
HTTP 请求头允许客户端和服务器在 HTTP 请求或响应中传递附加信息，通常被视为元数据。

通常用于强制一些特定的请求头字段，例如 `Authorization`。

请求头与 `fetch` API 中的 `body` 提供的内容相同。

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia 将请求头解析为小写键的形式。

请确保在使用请求头验证时使用小写字段名。
:::

## Cookie
请求的 Cookie 是通过请求的 Cookie 传递的数据。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie, {
                     // ^?



		cookie: t.Cookie({
			cookieName: t.String()
		})
	})
```

Cookie 必须以 `t.Cookie` 或 `t.Object` 的形式提供。

与 `headers` 相同，请求头的 `additionalProperties` 默认设置为 `true`。

### 规范

HTTP Cookie 是服务器发送给客户端的一小段数据，它是在每次访问同一台 Web 服务器时与请求一起发送的，用于让服务器记住客户端信息。

简单来说，就是随每个请求一起发送的字符串化状态。

通常用于强制一些特定的 Cookie 字段。

Cookie 是一个特殊的请求头字段，Fetch API 不接受自定义值，但由浏览器管理。要发送 Cookie，必须使用 `credentials` 字段：

```typescript
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### t.Cookie
`t.Cookie` 是一个特殊类型，相当于 `t.Object`，但允许设置 Cookie 的特定选项。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie.name.value, {
                      // ^?




		cookie: t.Cookie({
			name: t.String()
		}, {
			secure: true,
			httpOnly: true
		})
	})
```

## Response
响应是从处理程序返回的数据。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', () => {
		return {
			name: 'Jane Doe'
		}
	}, {
		response: t.Object({
			name: t.String()
		})
	})
```

### 按状态设置响应
响应可以根据状态码设置。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', ({ error }) => {
		if (Math.random() > 0.5)
			return error(400, {
				error: 'Something went wrong'
			})

		return {
			name: 'Jane Doe'
		}
	}, {
		response: {
			200: t.Object({
				name: t.String()
			}),
			400: t.Object({
				error: t.String()
			})
		}
	})
```

## 可选属性
要使一个字段可选，我们可以使用 `t.Optional`。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/optional', ({ query }) => query, {
                       // ^?




		query: t.Optional(
			t.Object({
				name: t.String()
			})
		)
	})
```

这是 Elysia 的一个特有功能，允许我们使一个字段可选。

## 守卫

守卫可以用于将模式应用于多个处理程序。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/none', ({ query }) => 'hi')
                   // ^?

    .guard({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query }) => query)
                    // ^?
    .listen(3000)
```

<br>

此代码确保每个处理程序后面的查询必须有名为 `name` 的字符串值。响应应如下所示：

<Playground
    :elysia="demo1"
    :mock="{
        '/query': {
            GET: 'Elysia'
        }
    }"
/>

响应应如下所示：

| 路径          | 响应     |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

如果为相同的属性定义了多个全局模式，则最新的模式将具有优先级。如果定义了本地和全局模式，则本地模式将具有优先级。

## 标准化
您可以使用 Elysia 构造函数通过 `normalize` 选项设置传出和传入体中未知字段的行为。默认情况下，elysia 会在请求或响应包含在其模式的字段之外的情况下引发错误。

您可以在构建 Elysia 实例时将 `normalize` 设置为 true 来更改此设置。

```ts
import { Elysia, t } from 'elysia'

new Elysia({
    normalize: true
})
```

## 基本类型

TypeBox API 的设计与 TypeScript 类型类似。

它有很多熟悉的名称和行为，与 TypeScript 的对应部分（如 **String**、**Number**、**Boolean** 和 **Object**）有重合，还有更高级的功能，如 **Intersect**、**KeyOf**、**Tuple** 等。

如果您熟悉 TypeScript，创建一个 TypeBox 模式的行为与编写一个 TypeScript 类型的行为相同，只是它提供了运行时的实际类型验证。

要创建您的第一个模式，请从 Elysia 导入 `Elysia.t` 并从最基本的类型开始：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

此代码告诉 Elysia 验证传入的 HTTP body，确保 body 是一个字符串，并且如果是一个字符串，则允许它通过请求管道和处理程序。

如果形状不匹配，它将抛出一个错误，进入 [错误生命周期](/essential/life-cycle.html#events)。

![Elysia 生命周期](/assets/lifecycle.webp)

### 基本类型

TypeBox 提供了与 TypeScript 类型相同行为的基本原始类型。

以下表格列出了最常见的基本类型：

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String()
```

</td>
<td>

```typescript
string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number()
```

</td>
<td>

```typescript
number
```

</td>
</tr>

<tr>
<td>

```typescript
t.Boolean()
```

</td>
<td>

```typescript
boolean
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number()
)
```

</td>
<td>

```typescript
number[]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
})
```

</td>
<td>

```typescript
{
    x: number
}
```

</td>
</tr>

<tr>
<td>

```typescript
t.Null()
```

</td>
<td>

```typescript
null
```

</td>
</tr>

<tr>
<td>

```typescript
t.Literal(42)
```

</td>
<td>

```typescript
42
```

</td>
</tr>

</table>

Elysia 扩展了 TypeBox 的所有类型，允许您引用大多数 TypeBox API 来在 Elysia 中使用。

有关 TypeBox 支持的其他类型，请参阅 [TypeBox 的类型](https://github.com/sinclairzx81/typebox#json-types)。

### 属性

TypeBox 可以接受一个参数，用于基于 JSON Schema 7 规范提供更全面的行为。

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email'
})
```

</td>
<td>

```typescript
saltyaom@elysiajs.com
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number({
    minimum: 10,
    maximum: 100
})
```

</td>
<td>

```typescript
10
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number(),
    {
        /**
         * Minimum number of items
         */
        minItems: 1,
        /**
         * Maximum number of items
         */
        maxItems: 5
    }
)
```

</td>
<td>

```typescript
[1, 2, 3, 4, 5]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number()
    },
    {
        /**
         * @default false
         * Accept additional properties
         * that not specified in schema
         * but still match the type
         */
        additionalProperties: true
    }
)
```

</td>
<td>

```typescript
x: 100
y: 200
```

</td>
</tr>

</table>

有关每个属性的更多详细信息，请参阅 [JSON Schema 7 规范](https://json-schema.org/draft/2020-12/json-schema-validation)。

---

<br>

## 荣耀提及

以下是在创建模式时通常有用的常见模式。

### Union

通过联合类型允许多种类型。

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Union([
    t.String(),
    t.Number()
])
```

</td>
<td>

```typescript
string | number
```

</td>

<td>

```
Hello
123
```

</td>
</tr>

</table>

### 可选

在 `t.Object` 的一个属性中提供，允许字段是未定义的或可选的。

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number(),
    y: t.Optional(t.Number())
})
```

</td>
<td>

```typescript
{
    x: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    x: 123
}
```

</td>
</tr>

</table>

### Partial

允许 `t.Object` 中的所有字段都是可选的。

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Partial(
    t.Object({
        x: t.Number(),
        y: t.Number()
    })
)
```

</td>
<td>

```typescript
{
    x?: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    y: 123
}
```

</td>
</tr>

</table>

## Custom Error

TypeBox 提供了额外的 "**error**" 属性，允许我们在字段无效时返回自定义的错误消息。

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: 'Invalid email :('
})
```

</td>
<td>

```
Invalid Email :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UwU'
})
```

</td>
<td>

```
Invalid object UwU
```

</td>
</tr>

</table>

## Elysia 类型

`Elysia.t` 基于 TypeBox，并进行了预配置，以便在服务器上使用，同时还提供了服务器端验证中常见的额外类型。

您可以在 `elysia/type-system` 中找到 Elysia 类型的所有源代码。

以下是 Elysia 提供的类型：

<Deck>
    <Card title="Numeric" href="#numeric">
        接受一个数字字符串或数字，然后将值转换为数字。
    </Card>
    <Card title="File" href="#file">
        一个单独的文件。通常在<strong>文件上传</strong>验证时很有用。
    </Card>
    <Card title="Files" href="#files">
        从 <a href="#file">File</a> 扩展，但为单个字段中的文件数组添加了支持。
    </Card>
    <Card title="Cookie" href="#cookie">
        对象样式的Cookie Jar表示，从对象类型扩展而来。
    </Card>
    <Card title="Nullable" href="#nullable">
        允许值为 null，但不能是 undefined
    </Card>
    <Card title="Maybe Empty" href="#maybeempty">
        接受空字符串或 null 值
    </Card>
</Deck>

### 数值（旧版）

数值接受一个数值字符串或数字，然后将值转换为数字。

```typescript
t.Numeric()
```

当传入的值是一个数字字符串时，比如路径参数或查询字符串，这很有用。

Numeric 接受与 [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num) 相同的属性。

::: tip
这不需要，因为 Elysia 类型已经自动将 Number 转换为 Numeric。
:::

### 文件

一个单独的文件。通常用于**文件上传**验证。

```typescript
t.File()
```

文件扩展属性的基础模式，具有以下附加属性：

#### type

文件格式，如图片、视频、音频。

如果提供数组，将尝试验证任何格式是否有效。

```typescript
type?: MaybeArray<string>
```

#### minSize

文件的最小大小。

接受以字节为单位或文件单位的缩写形式表示的数字：

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

#### maxSize

文件的最大大小。

接受以字节为单位或文件单位的后缀表示的数字：

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### 文件单位后缀：

以下为文件单位的规格：
m: 兆字节 (1048576 字节)
k: 千字节 (1024 字节)

### Files

从[文件](#file)扩展，但在单个字段中添加了对文件数组的支。

```typescript
t.Files()
```

文件扩展了基础模式、数组和文件的属性。

### Cookie

从对象类型扩展的 Cookie Jar 的对象表示形式。

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie 扩展了 [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) 和 [Cookie](https://github.com/jshttp/cookie#options-1) 的属性，并具有以下附加属性：

#### secrets

用于签名的密钥。

接受字符串或字符串数组。

```typescript
secrets?: string | string[]
```

如果提供了数组，将使用[密钥轮换](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation)，新签名的值将使用第一个秘密作为密钥。

### 可以为空

允许值为 null，但不允许为 undefined。

```typescript
t.Nullable(t.String())
```

### 可能为空

允许值是 null 和 undefined。

```typescript
t.MaybeEmpty(t.String())
```

要获取类型系统的完整源代码，您可以在 [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts) 中找到。

## 错误提供者

当验证失败时，有 2 种方式提供自定义错误消息：

1. 内联 `error` 属性
2. 使用 [onError](/life-cycle/on-error) 事件

### 错误属性

Elysia 提供了一个额外的 "**error**" 属性，允许我们在字段无效时返回自定义错误消息。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object(
            {
                x: t.Number()
            },
            {
                error: 'x must be a number'
            }
        )
    })
    .listen(3000)
```

The following is an example of usage of the error property on various types:

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: 'Invalid email :('
})
```

</td>
<td>

```
Invalid Email :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.String(),
    {
        error: 'All members must be a string'
    }
)
```

</td>
<td>

```
All members must be a string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UwU'
})
```

</td>
<td>

```
Invalid object UwU
```

</td>
</tr>
<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error({ errors, type, validation, value }) {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```
Expected x to be a number
```

</td>
</tr>

</table>

### Error message as function
Over a string, Elysia type's error can also accepts a function to programatically return custom error for each property.

The error function accepts same argument as same as `ValidationError`

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error() {
                    return 'Expected x to be a number'
                }
            })
        })
    })
    .listen(3000)
```

::: tip
将鼠标悬停在 `error` 上以查看类型
:::

### Error is called per field
请注意，只有在字段无效时才会调用 error 函数。

请考虑以下表格：

<table class="md-table">
<tr>
<td>Code</td>
<td>Body</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
{
    x: "hello"
}
```

</td>
<td>
Expected x to be a number
</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
"hello"
```

</td>
<td>
(default error, `t.Number.error` is not called)
</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number({
            error() {
                return 'Expected x to be a number'
            }
        })
    }, {
        error() {
            return 'Expected value to be an object'
        }
    }
)
```

</td>
<td>

```json
"hello"
```

</td>
<td>
Expected value to be an object
</td>
</tr>

</table>

### onError

我们可以根据 [onError](/life-cycle/on-error) 事件的错误代码调用“**VALIDATION**”来定制验证的行为。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

缩小了错误类型，将被类型化为从 'elysia/error' 导入的 `ValidationError`。

**ValidationError** 暴露了一个名为 **validator** 的属性，其类型为 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)，使我们能够开箱即用地与 TypeBox 功能进行交互。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.validator.Errors(error.value).First().message
    })
    .listen(3000)
```

### Error list

**ValidationError** 提供了 `ValidatorError.all` 方法，允许我们列出所有的错误原因。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
			age: t.Number()
		}),
		error({ code, error }) {
			switch (code) {
				case 'VALIDATION':
                    console.log(error.all)

                    // Find a specific error name (path is OpenAPI Schema compliance)
                    const name = error.all.find(
						(x) => x.summary && x.path === '/name'
					)

                    // If has a validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

有关 TypeBox 验证器的更多信息，请参阅 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)。

## 引用模型
有时，您可能会发现自己声明重复的模型，或使用相同的模型多次。

通过引用模型，我们可以为模型命名，并通过引用名称在 `schema` 中直接引用它，以实现代码自动补全。

让我们先从一个简单的场景开始。

假设我们有一个处理登录的控制器，其处理程序使用相同的模型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

我们可以通过将模型提取为变量并引用它们来重构代码。
```typescript twoslash
import { Elysia, t } from 'elysia'

// Maybe in a different file eg. models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: SignDTO,
        response: SignDTO
    })
```

将模型分离出来的此方法是一个有效的方案，但随着应用程序变得更复杂，我们可能会发现自己在多个控制器中重用多个模型。

我们可以通过创建“引用模型”来解决这个问题，允许我们为模型命名并在 Elysia 的 `model` 中通过自动补全直接引用它们。

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

当要访问模型组时，我们可以将 `model` 分离为一个插件，注册该插件时会提供一组模型，而不是多个导入。

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

然后在一个实例文件中：
```typescript twoslash
// @filename: auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// @filename: index.ts
// ---cut---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

这样不仅允许我们分离关注点，还允许我们在多个位置重用模型，同时将模型报告到 Swagger 文档中。

### 多个模型
`model` 可以接受一个对象，其键作为模型名称，值作为模型定义，支持多个模型。

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        number: t.Number(),
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

### 命名约定
重复的模型名称将导致 Elysia 抛出一个错误。为了防止重复声明模型名称，我们可以使用以下命名约定。

假设我们的所有模型都存储在 `models/<name>.ts` 中，并将模型的前缀声明为命名空间。

```typescript
import { Elysia, t } from 'elysia'

// admin.model.ts
export const adminModels = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const userModels = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

这可以在某种程度上防止命名冲突，但最终，最好根据团队的协议决定命名约定。

Elysia 为您提供了一个具有明确目的的选项，以防止纠结于决策疲劳。
