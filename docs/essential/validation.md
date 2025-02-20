---
title: Schema - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS

    - - meta
      - name: 'description'
        content: Schema 是严格类型的定义，用于推断 TypeScript 的类型和对传入请求及传出响应的数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，一个用于数据验证的 TypeScript 库。

    - - meta
      - property: 'og:description'
        content: Schema 是严格类型的定义，用于推断 TypeScript 的类型和对传入请求及传出响应的数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，一个用于数据验证的 TypeScript 库。
---

<script setup>
import { Elysia, t, ValidationError } from 'elysia'

import Playground from '../components/nearl/playground.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

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

const demo3 = new Elysia()
 	.guard({
        query: t.Object({
            name: t.Number()
        })
    })
    .get('/query?id=1', ({ query: { id } }) => id)
    .get('/query?id=salt', ({ query: { id } }) => id)

const demo4 = new Elysia()
 	.guard({
        query: t.Object({
            name: t.Array(t.String()),
            squad: t.String()
        })
    })
    .get('/query?name=rapi,anis,neon&squad=counter', ({ query: { id } }) => id)
    .get('/query?name=rapi&name=anis&name=neon&squad=counter', ({ query: { id } }) => id)
</script>

# 验证

创建 API 服务器的目的在于接收输入并对其进行处理。

JavaScript 允许任何数据成为任何类型。Elysia 提供了一个工具，可以对数据进行验证，以确保数据的格式正确。

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

**Elysia.t** 是基于 [TypeBox](https://github.com/sinclairzx81/typebox) 的模式构建器，提供了运行时、编译时和 OpenAPI 模式的类型安全，用于生成 OpenAPI/Swagger 文档。

TypeBox 是一个非常快速、轻量且类型安全的 TypeScript 运行时验证库。Elysia 扩展并定制了 TypeBox 的默认行为，以适应服务器端验证。

我们相信，这样的集成应该默认处理框架，而不是依赖用户在每个项目中设置自定义类型。

## 模式类型
Elysia 支持具有以下类型的声明式模式：

<Deck>
    <Card title="主体" href="#body">
        验证传入的 HTTP 消息
    </Card>
    <Card title="查询" href="#query">
        查询字符串或 URL 参数
    </Card>
    <Card title="参数" href="#params">
        路径参数
    </Card>
    <Card title="头部" href="#headers">
        请求的头部
    </Card>
    <Card title="Cookie" href="#cookie">
        请求的 Cookie
    </Card>
    <Card title="响应" href="#response">
        请求的响应
    </Card>
</Deck>

---

这些属性应作为路由处理器的第三个参数提供，以验证传入请求。

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

响应应如下所示：
| URL | 查询 | 参数 |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

当提供模式时，类型将自动从模式中推断，并生成 OpenAPI 类型以生成 Swagger 文档，省去手动提供类型的冗余工作。

## 主体
传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) 是发送到服务器的数据。它可以是 JSON、表单数据或任何其他格式。

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

验证应如下所示：
| 主体 | 验证 |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

Elysia 默认禁用了 **GET** 和 **HEAD** 消息的 body 解析，遵循 HTTP/1.1 规范 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> 如果请求方法不包括对实体主体的定义语义，则在处理请求时应忽略消息主体。

大多数浏览器默认禁用将主体附加到 **GET** 和 **HEAD** 方法。

### 规范
验证传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)（或主体）。

这些消息是供 Web 服务器处理的附加消息。

主体与 `fetch` API 中的 `body` 图相同提供。内容类型应根据定义的主体进行相应设置。

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
文件是一种特殊的主体类型，可用于上传文件。
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?





		body: t.Object({
			file: t.File({ format: 'image/*' }),
			multipleFiles: t.Files()
		})
	})
	.listen(3000)
```

通过提供文件类型，Elysia 将自动假设内容类型为 `multipart/form-data`。

## 查询
查询是通过 URL 发送的数据。可以采用 `?key=value` 的形式。

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

验证应如下所示：
| 查询 | 验证 |
| ---- | --------- |
| /?name=Elysia | ✅ |
| /?name=1 | ✅ |
| /?alias=Elysia | ❌ |
| /?name=ElysiaJS&alias=Elysia | ✅ |
| / | ❌ |

### 规范

查询字符串是 URL 的一部分，以 **?** 开头，可以包含一个或多个查询参数，这些参数是用于向服务器传达附加信息的一对键值对，通常用于自定义行为，例如过滤或搜索。

![URL 对象](/essential/url-object.svg)

查询在 Fetch API 的 **?** 之后提供。

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

在指定查询参数时，必须了解所有查询参数值必须表示为字符串。这是因为它们的编码和添加到 URL 的方式。

### 强制
Elysia 将自动将 `query` 强制转换为 schema。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ query }) => query, {
               // ^?




		query: t.Object({ // [!code ++]
			name: t.Number() // [!code ++]
		}) // [!code ++]
	})
	.listen(3000)
```

<Playground
    :elysia="demo3"
    :mock="{
        '/query?id=1': {
            GET: '1'
        },
        '/query?id=salt': {
        	GET: 'string cannot be assigned to number'
        }
    }"
/>

### 数组
默认情况下，Elysia 将查询参数视为一个单一字符串，即使它被指定多次。

要使用数组，我们需要明确将其声明为数组。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ query }) => query, {
               // ^?




		query: t.Object({
			name: t.Array(t.String()) // [!code ++]
		})
	})
	.listen(3000)
```

<Playground
    :elysia="demo4"
    :mock="{
        '/query?name=rapi,anis,neon&squad=counter': {
            GET: JSON.stringify({
                name: ['rapi', 'anis', 'neon'],
                squad: 'counter'
            }, null, 4)
        },
        '/query?name=rapi&name=anis&name=neon&squad=counter': {
        	GET: JSON.stringify({
                name: ['rapi', 'anis', 'neon'],
                squad: 'counter'
            }, null, 4)
        }
    }"
/>

一旦 Elysia 检测到某个属性可以赋值为数组，Elysia 将其强制转换为指定类型的数组。

默认情况下，Elysia 将查询数组格式化为以下格式：

#### nuqs
此格式由 [nuqs](https://nuqs.47ng.com) 使用。

通过使用 **,** 作为分隔符，属性将被视为数组。

```
http://localhost?name=rapi,anis,neon&squad=counter
{
	name: ['rapi', 'anis', 'neon'],
	squad: 'counter'
}
```

#### HTML 表单格式
如果一个键被分配多次，该键将被视为数组。

这与 HTML 表单格式类似，当一个名称相同的输入被指定多次时。

```
http://localhost?name=rapi&name=anis&name=neon&squad=counter
// name: ['rapi', 'anis', 'neon']
```

## 参数
参数或路径参数是通过 URL 路径发送的数据。

可以采用 `/key` 的形式。

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

参数必须以对象的形式提供。

验证应如下所示：
| URL | 验证 |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

### 规范
路径参数 <small>(不要与查询字符串或查询参数混淆)</small>。

**通常不需要此字段，因为 Elysia 可以自动推断路径参数的类型**，除非需要特定值模式，例如数字值或模板字面量模式。

```typescript
fetch('https://elysiajs.com/id/1')
```

### 参数类型推断
如果未提供参数模式，Elysia 将自动将类型推断为字符串。
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## 头部
头部是通过请求的头部发送的数据。

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

与其他类型不同，头部的 `additionalProperties` 默认设置为 `true`。

这意味着头部可以包含任何键值对，但值必须符合模式。

### 规范
HTTP 头部允许客户端和服务器通过 HTTP 请求或响应传递附加信息，通常视为元数据。

此字段通常用于强制执行某些特定的头部字段，例如 `Authorization`。

头部与 `fetch` API 中的 `body` 以相同方式提供。

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia 将仅以小写键解析头部。

请确保在使用头部验证时使用小写字段名称。
:::

## Cookie
Cookie 是通过请求的 Cookie 发送的数据。

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

与 `headers` 相同，头部的 `additionalProperties` 默认设置为 `true`。

### 规范

HTTP Cookie 是服务器发送给客户端的小数据块，这是数据，在每次访问同一网页服务器时都会发送，以便让服务器记住客户端信息。

简单来说，一种字符串化的状态，在每个请求中发送。

此字段通常用于强制执行某些特定的 cookie 字段。

Cookie 是一个特殊的头部字段，Fetch API 不接受自定义值，而是由浏览器管理。要发送 Cookie，必须使用 `credentials` 字段：

```typescript
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### t.Cookie
`t.Cookie` 是一种特殊类型，相当于 `t.Object`，但允许设置 cookie 特定选项。

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

## 响应
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
响应可以按状态代码设置。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', ({ error }) => {
		if (Math.random() > 0.5)
			return error(400, {
				error: '出了点问题'
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

## 可选
要使字段可选，可以使用 `t.Optional`。

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

这是 Elysia 特定的功能，允许我们使字段可选。

## 防护

防护可用于将模式应用于多个处理程序。

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

这段代码确保查询必须包含 **name**，并且其值为字符串，对于后面的每个处理程序。响应应列出如下：

<Playground
    :elysia="demo1"
    :mock="{
        '/query': {
            GET: 'Elysia'
        }
    }"
/>

响应应列出如下：

| 路径          | 响应 |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

如果多个全局模式针对同一属性定义，则最新的将优先。如果同时定义了本地和全局模式，则本地模式将优先。

## 标准化
您可以使用 Elysia 构造函数通过 `normalize` 选项设置传入和传出主体中未知字段的行为。默认情况下，当请求或响应包含不明确允许的字段时，elysia 将引发错误。

您可以在构造您的 elysia 实例时将 `normalize` 设置为 true 来更改这一点。

```ts
import { Elysia, t } from 'elysia'

new Elysia({
    normalize: true
})
```

## 基本类型

TypeBox API 设计围绕 TypeScript 类型，

并且与 TypeScript 相关的许多熟悉名称和行为交织在一起，包括： **String**、**Number**、**Boolean** 和 **Object** 以及更高级的特性如 **Intersect**、**KeyOf**、**Tuple** 以增加多样性。

如果您熟悉 TypeScript，则创建 TypeBox 模式的行为与编写 TypeScript 类型相同，只是它在运行时提供实际的类型验证。

要创建第一个模式，请从 Elysia 中导入 `Elysia.t` 并从最基本的类型开始：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

此代码告诉 Elysia 验证传入的 HTTP 主文，确保主体是字符串，如果是字符串，则允许其通过请求管道和处理程序。

如果形状不匹配，则将抛出错误，进入 [错误生命周期](/essential/life-cycle.html#on-error)。

![Elysia 生命周期](/assets/lifecycle.webp)

### 基本类型

TypeBox 提供了与 TypeScript 类型相同行为的基本原始类型。

以下表列出了最常见的基本类型：

<table class="md-table">
<tbody>
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
</tbody>
</table>

Elysia 从 TypeBox 中扩展了所有类型，允许您从 TypeBox 中参考大多数 API 用于 Elysia。

有关 TypeBox 支持的其他类型，请参见 [TypeBox 的类型](https://github.com/sinclairzx81/typebox#json-types)。

### 属性

TypeBox 可以接受一个参数，以便根据 JSON Schema 7 规范提供更全面的行为。

<table class="md-table">
<tbody>
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
         * 最小项数
         */
        minItems: 1,
        /**
         * 最大项数
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
         * 接受未在模式中
         * 指定的附加属性
         * 但仍然匹配所需类型
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
</tbody>
</table>

有关每个属性的更多解释，请参见 [JSON Schema 7 规范](https://json-schema.org/draft/2020-12/json-schema-validation)。

## 荣誉提名

以下是创建模式时通常发现有用的常见模式。

### 联合

通过联合允许多种类型。

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>值</td>
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
</tbody>
</table>

### 可选

在 `t.Object` 的一个属性中提供，允许字段为 undefined 或可选。

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>值</td>
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
</tbody>
</table>

### 部分

允许 `t.Object` 中的所有字段都是可选的。

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>值</td>
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
</tbody>
</table>

## 自定义错误

TypeBox 提供了一个额外的 "**错误**" 属性，允许我们在字段无效时返回自定义错误消息。

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>错误</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: '无效的电子邮箱 :( '
})
```

</td>
<td>

```
无效的电子邮箱 :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: '无效的对象 UwU'
})
```

</td>
<td>

```
无效的对象 UwU
```

</td>
</tr>
</tbody>
</table>

## Elysia 类型

`Elysia.t` 基于 TypeBox，为服务器使用提供了预配置，同时提供了常见的服务器端验证中常用的附加类型。

您可以在 `elysia/type-system` 中找到所有 Elysia 类型的源代码。

以下是 Elysia 提供的类型：

<Deck>
	<Card title="UnoinEnum" href="#unionenum">
		`UnionEnum` 允许值为指定值之一。
    </Card>
    <Card title="文件" href="#file">
        单个文件。通常用于<strong>文件上传</strong>验证。
    </Card>
    <Card title="文件集合" href="#files">
        扩展自 <a href="#file">文件</a>，但为单个字段添加对文件数组的支持
    </Card>
    <Card title="Cookie" href="#cookie">
        从对象类型扩展的 Cookie 罐的对象视图
    </Card>
    <Card title="可空" href="#nullable">
    允许值为 null，但不允许为 undefined
    </Card>
    <Card title="可能为空" href="#maybeempty">
        接受空字符串或 null 值
    </Card>
    <Card title="数字" href="#numeric-legacy">
        接受一个数字字符串或数字，然后将其值转换为数字
    </Card>
</Deck>

### UnionEnum

`UnionEnum` 允许值为指定值之一。

```typescript
t.UnionEnum(['rapi', 'anis', 1, true, false])
```

默认情况下，这些值不会自动

### 文件

单个文件。通常用于 **文件上传** 验证。

```typescript
t.File()
```

文件扩展了基本模式的属性，附加属性如下：

#### 类型

文件的格式，如图像、视频、音频。

如果提供一个数组，将尝试验证其中任何一种格式是否有效。

```typescript
type?: MaybeArray<string>
```

#### 最小大小

文件的最小大小。

接受以字节为单位的数字或文件单位的后缀：

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

#### 最大大小

文件的最大大小。

接受以字节为单位的数字或文件单位的后缀：

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### 文件单位后缀：

以下是文件单位的规格：
m: 兆字节（1048576 字节）
k: 千字节（1024 字节）

### 文件集合

扩展自 [文件](#file)，但添加了对单个字段中数组文件的支持。

```typescript
t.Files()
```

文件扩展了基本模式的属性、数组和文件。

### Cookie

从对象类型扩展的 Cookie 罐的对象视图。

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie 扩展了 [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) 和 [Cookie](https://github.com/jshttp/cookie#options-1) 的属性，并具有以下附加属性：

#### secrets

签名 Cookie 的密钥。

接受字符串或字符串数组

```typescript
secrets?: string | string[]
```

如果提供数组，将使用 [密钥轮换](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation)，新签名的值将使用第一个密钥作为密钥。

### 可空

允许值为 null，但不允许为 undefined。

```typescript
t.Nullable(t.String())
```

### 可能为空

允许值为 null 和 undefined。

```typescript
t.MaybeEmpty(t.String())
```

有关更多信息，您可以在 [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts) 中找到类型系统的完整源代码。

### 数字（遗留）
::: warning
这不是必需的，因为 Elysia 类型自 1.0 以来已经自动将数字转换为数值。
:::

Numeric 接受一个数字字符串或数字，然后将该值转换为数字。

```typescript
t.Numeric()
```

当传入值是一个数字字符串时，这很有用，例如路径参数或查询字符串。

数字接受与 [数字实例](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num) 相同的属性。

## 错误提供者

在验证失败时，有两种方法可以提供自定义错误消息：

1. 内联 `error` 属性
2. 使用 [onError](/essential/life-cycle.html#on-error) 事件

### 错误属性

Elysia 提供了一个额外的 "**错误**" 属性，允许我们在字段无效时返回自定义错误消息。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
               	error: 'x 必须是数字'
            })
        })
    })
    .listen(3000)
```

以下是在各种类型上使用错误属性的示例：

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>错误</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: '无效的电子邮箱 :('
})
```

</td>
<td>

```
无效的电子邮箱 :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.String(),
    {
        error: '所有成员必须是字符串'
    }
)
```

</td>
<td>

```
所有成员必须是字符串
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: '无效的对象 UwU'
})
```

</td>
<td>

```
无效的对象 UwU
```

</td>
</tr>
<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error({ errors, type, validation, value }) {
            return '期望 x 为数字'
        }
    })
})
```

</td>
<td>

```
期望 x 为数字
```

</td>
</tr>
</tbody>
</table>

### 错误消息作为函数
除了字符串外，Elysia 类型的错误也可以接受一个函数，以程序化地为每个属性返回自定义错误。

错误函数接受与 `ValidationError` 相同的参数。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error() {
                    return '期望 x 为数字'
                }
            })
        })
    })
    .listen(3000)
```

::: tip
悬停在 `error` 上以查看类型
:::

### 错误按字段调用
请注意，仅当字段无效时，错误函数才会被调用。

请考虑以下表：

<table class="md-table">
<tbody>
<tr>
<td>代码</td>
<td>主体</td>
<td>错误</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return '期望 x 为数字'
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
期望 x 为数字
</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return '期望 x 为数字'
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
(默认错误， `t.Number.error` 不会被调用)
</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number({
            error() {
                return '期望 x 为数字'
            }
        })
    }, {
        error() {
            return '期望值为对象'
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
期望值为对象
</td>
</tr>
</tbody>
</table>

### onError

我们可以根据 [onError](/essential/life-cycle.html#on-error) 事件自定义验证行为，缩小到一个错误代码 "**VALIDATION**"。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

缩小的错误类型将被表示为 `ValidationError` 从 **elysia/error** 导入。

**ValidationError** 暴露了名为 **validator** 的属性，类型为 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)，允许我们与 TypeBox 功能直接交互。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.validator.Errors(error.value).First().message
    })
    .listen(3000)
```

### 错误列表

**ValidationError** 提供了一个方法 `ValidatorError.all`，允许我们列出所有的错误原因。

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

                    // 查找特定错误名称（路径符合 OpenAPI 架构）
                    const name = error.all.find(
						(x) => x.summary && x.path === '/name'
					)

                    // 如果有验证错误，则记录它
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

有关 TypeBox 的验证器的更多信息，请参见 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)。

## 引用模型
有时您可能会发现自己声明重复模型，或多次重用相同模型。

通过引用模型，我们可以为模型命名，并通过引用名称重复使用它们。

让我们从一个简单的场景开始。

假设我们有一个处理登录的控制器，使用同一个模型。

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

我们可以通过提取模型作为变量的方式重构代码，并引用它们。
```typescript twoslash
import { Elysia, t } from 'elysia'

// 也许在不同的文件，例如 models.ts
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

这种分离关注的方法是有效的，但随着应用的复杂性增加，我们可能会发现自己在不同的控制器中重用多个模型。

我们可以通过创建 "引用模型" 来解决此问题，允许我们命名模型并使用自动完成直接在 `schema` 中引用它，同时通过 `model` 注册模型。

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
        // 在现有模型名称的上下文中使用自动完成
        body: 'sign',
        response: 'sign'
    })
```

当我们想访问模型组时，可以将一个 `model` 分离成一个插件，当注册时将提供一组模型，而不是多个导入。

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

然后在实例文件中：
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
// ---省略---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // 在现有模型名称的上下文中使用自动完成
        body: 'sign',
        response: 'sign'
    })
```

这不仅可以让我们分离关注，还可以在多个地方重用模型，同时将模型报告到 Swagger 文档中。

### 多个模型
`model` 接受一个对象，键为模型名称，值为模型定义，默认支持多个模型。

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
重复的模型名称会导致 Elysia 抛出错误。为防止声明重复的模型名称，我们可以使用以下命名约定。

假设我们在 `models/<name>.ts` 中存储所有模型，并声明模型的前缀作为命名空间。

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

这可以在某种程度上防止命名冲突，但最终，最好的选项是让团队对命名约定的决定达成一致。

Elysia 提供了一种有见地的选项，供您决定以防止决策疲劳。
