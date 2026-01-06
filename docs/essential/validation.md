---
title: 验证 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 验证 - ElysiaJS

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
import TutorialBadge from '../components/arona/badge.vue'

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

# 验证 <TutorialBadge href="/tutorial/getting-started/validation" />

Elysia 提供了一个内置模式，用于验证数据，确保数据格式正确。

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

**Elysia.t** 是基于 [TypeBox](https://github.com/sinclairzx81/typebox) 的模式构建器，提供运行时、编译时的类型安全以及从单一数据源生成 OpenAPI 模式。

Elysia 为服务器端验证定制了 TypeBox，以提供无缝体验。

### 标准 Schema
Elysia 也支持 [Standard Schema](https://github.com/standard-schema/standard-schema)，允许您使用喜欢的验证库：
- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi
- [以及更多](https://github.com/standard-schema/standard-schema)

使用 Standard Schema，只需导入对应的 schema 并传递给路由处理器。

```typescript twoslash
import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

new Elysia()
	.get('/id/:id', ({ params: { id }, query: { name } }) => id, {
	//                           ^?
		params: z.object({
			id: z.coerce.number()
		}),
		query: v.object({
			name: v.literal('Lilith')
		})
	})
	.listen(3000)
```

您可以在同一个处理器中无缝使用多种验证器。

## Schema 类型
Elysia 支持以下声明式模式类型：

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

这些属性应作为路由处理器的第三个参数提供，用于验证传入请求。

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

响应示例：
| URL | 查询 | 参数 |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

当提供模式时，类型会自动从模式推断，并生成用于 API 文档的 OpenAPI 类型，消除了手动提供类型的重复工作。

## Guard

Guard 可用于将模式应用于多个处理器。

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

这段代码确保在之后的每个处理器中，查询中必须包含字符串类型的 **name** 属性。响应示例如下：

<Playground
    :elysia="demo1"
    :mock="{
        '/query': {
            GET: 'Elysia'
        }
    }"
/>

响应结果：

| 路径          | 响应 |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

如果为同一属性定义了多个全局 Guard 模式，最后一个生效。如果同时定义本地与全局模式，则本地优先。

### Guard Schema 类型
Guard 支持两种验证模式定义类型。

### **覆盖（默认）**

模式冲突时，后者覆盖前者。

![Elysia 默认覆盖模式运行示意](/blog/elysia-13/schema-override.webp)

### **独立** <TutorialBadge href="/tutorial/patterns/standalone-schema" />

分别处理冲突的模式并独立运行，确保两个模式都被验证。

![Elysia 独立运行多个守护合并示意](/blog/elysia-13/schema-standalone.webp)

通过使用 `schema` 属性定义 Guard 的模式类型：

```ts
import { Elysia } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		response: t.Object({
			title: t.String()
		})
	})
```

## 主体
传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) 是发送到服务器的数据，可以是 JSON、表单数据或其他任意格式。

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

验证示例：
| 主体 | 验证 |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

Elysia 默认禁用 **GET** 和 **HEAD** 请求的 body 解析，遵循 HTTP/1.1 规范 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> 如果请求方法不包含实体主体的定义语义，则应忽略消息主体。

大多数浏览器默认不允许在 **GET** 和 **HEAD** 方法中发送主体。

#### 规范
验证传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)（也即主体）。

这些消息是供 Web 服务器处理的附加信息。

主体对应于 `fetch` API 中的 `body`。内容类型应根据定义的主体类型适当设置。

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
文件是特殊的主体类型，用于文件上传。

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

通过指定文件类型，Elysia 会自动假设内容类型为 `multipart/form-data`。

### File（标准 Schema）
如果您使用标准 Schema，需要注意 Elysia 无法像 `t.File` 那样自动验证内容类型。

但 Elysia 导出了一个 `fileType` 函数，可通过魔数（magic number）验证文件类型。

```typescript twoslash
import { Elysia, fileType } from 'elysia'
import { z } from 'zod'

new Elysia()
	.post('/body', ({ body }) => body, {
		body: z.object({
			file: z.file().refine((file) => fileType(file, 'image/jpeg')) // [!code ++]
		})
	})
```

强烈建议您**使用** `fileType` 验证文件类型，因为大多数验证器无法正确验证文件，仅检查内容类型字段可能引发安全漏洞。

## 查询
查询是通过 URL 传递的数据，形式为 `?key=value`。

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

查询参数必须以对象形式提供。

验证示例：
| 查询 | 验证 |
| ---- | --------- |
| /?name=Elysia | ✅ |
| /?name=1 | ✅ |
| /?alias=Elysia | ❌ |
| /?name=ElysiaJS&alias=Elysia | ✅ |
| / | ❌ |

#### 规范

查询字符串是 URL 的一部分，以 **?** 开头，由一个或多个键值对组成，用于向服务器传递附加信息，常用于定制行为如过滤或搜索。

![URL 对象](/essential/url-object.svg)

查询参数紧随 Fetch API 请求的 **?** 之后。

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

指定查询参数时，所有参数值必须表示为字符串，因其被编码并附加到 URL。

### 强制转换
Elysia 会自动将查询中的值强制转换为模式所需的类型。

更多信息请参考 [Elysia 行为](/patterns/type#elysia-behavior)。

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
默认情况下，Elysia 将查询参数视为单个字符串，即使同一个键被多次指定。

若要使用数组，必须明确声明为数组类型。

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

一旦 Elysia 识别某属性为数组，会自动将其强制转换为指定类型的数组。

默认情况下，Elysia 支持以下查询数组格式：

#### nuqs
该格式被 [nuqs](https://nuqs.47ng.com) 使用。

通过 **,** 分隔符，将属性解析为数组。

```
http://localhost?name=rapi,anis,neon&squad=counter
{
	name: ['rapi', 'anis', 'neon'],
	squad: 'counter'
}
```

#### HTML 表单格式
当同一键多次出现时，该键被视为数组。

这与 HTML 表单格式相同，当相同名称的输入多次出现时。

```
http://localhost?name=rapi&name=anis&name=neon&squad=counter
// name: ['rapi', 'anis', 'neon']
```

## 参数
参数，或路径参数，是通过 URL 路径传递的数据，形式为 `/key`。

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

参数必须以对象形式提供。

验证示例：
| URL | 验证 |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

#### 规范
路径参数 <small>（区别于查询字符串或查询参数）</small>。

**通常无需额外声明，Elysia 会自动推断路径参数类型**，除非需要特定的值模式，如数字或模板字面量。

```typescript
fetch('https://elysiajs.com/id/1')
```

### 参数类型推断
如果未提供参数模式，Elysia 会默认将类型推断为字符串。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## 头部
头部是通过请求头发送的附加数据。

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

不同于其他类型，头部的 `additionalProperties` 默认允许为 `true`。

这意味着头部可以包含任意键值对，但其值必须符合模式。

#### 规范
HTTP 头部允许客户端和服务器传递附加信息，通常作为元数据处理。

该字段常用来强制某些特定头部字段，如 `Authorization`。

头部的使用与 Fetch API 中的 `body` 一致。

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia 只使用小写键名解析头部。

请确保验证时头部字段名称为小写。
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

Cookie 必须由 `t.Cookie` 或 `t.Object` 形式定义。

与 `headers` 类似，cookie 的 `additionalProperties` 默认设为 `true`。

#### 规范

HTTP Cookie 是服务器发送给客户端的小型数据块，每次访问同一网页服务器时都会自动发送，使服务器能记住客户端信息。

简单来说，Cookie 是每个请求中携带的字符串化状态。

该字段常用来强制某些特定 Cookie 字段。

Cookie 是特殊的请求头字段，Fetch API 不允许自定义，需要由浏览器管理。发送 Cookie 需设置 `credentials` 字段：

```typescript
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### t.Cookie
`t.Cookie` 是特殊类型，类似于 `t.Object`，但支持设置 Cookie 特定选项。

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
响应是处理器返回的数据。

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

### 按状态码设置响应
响应可以按 HTTP 状态码定义。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', ({ status }) => {
		if (Math.random() > 0.5)
			return status(400, {
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

这是 Elysia 独有的功能，允许设置不同状态码对应的响应结构。

## 错误提供器

验证失败时，有两种方式提供自定义错误消息：

1. 内联设置 `error` 属性
2. 通过 [onError](/essential/life-cycle.html#on-error) 事件

### 错误属性

Elysia 提供额外的 **error** 属性，允许针对字段无效时返回自定义错误消息。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error: 'x 必须是一个数字'
            })
        })
    })
    .listen(3000)
```

以下示例展示不同类型使用错误属性：

<table class="md-table">
<tbody>
<tr>
<td>TypeBox 类型</td>
<td>错误信息</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: '无效的电子邮件 :('
})
```

</td>
<td>

```
无效的电子邮件 :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.String(),
    {
        error: '所有成员必须是一个字符串'
    }
)
```

</td>
<td>

```
所有成员必须是一个字符串
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UnU'
})
```

</td>
<td>

```
Invalid object UnU
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

## 自定义错误

TypeBox 允许通过 "**error**" 属性自定义字段无效时的错误消息。

<table class="md-table">
<tbody>
<tr>
<td>TypeBox 类型</td>
<td>错误信息</td>
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
    error: 'Invalid object UnU'
})
```

</td>
<td>

```
Invalid object UnU
```

</td>
</tr>
</tbody>
</table>

### 错误消息为函数
除了字符串，Elysia 类型的 `error` 也可以是函数，为每个属性动态返回自定义错误消息。

错误函数的参数与 `ValidationError` 一致。

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
将鼠标悬停于 `error` 可查看类型提示。
:::

### 错误按字段调用
注意，错误函数只在对应字段无效时调用。

示例如下：

<table class="md-table">
<tbody>
<tr>
<td>代码</td>
<td>主体</td>
<td>错误消息</td>
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
（默认错误，`t.Number.error` 不被调用）
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

我们可以通过 [onError](/essential/life-cycle.html#on-error) 事件自定义验证行为，捕获错误代码 "**VALIDATION**"。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

简化后的错误类型表现为从 **elysia/error** 导入的 `ValidationError`。

**ValidationError** 暴露名为 **validator** 的属性，类型为 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)，允许直接操作 TypeBox 功能。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.all[0].message
    })
    .listen(3000)
```

### 错误列表

**ValidationError** 提供了方法 `ValidationError.all`，用于列出所有错误原因。

```typescript
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

                    // 查找特定错误，路径符合 OpenAPI 规范
                    const name = error.all.find(
						(x) => x.summary && x.path === '/name'
					)

                    // 若存在验证错误则打印
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

关于 TypeBox 验证器更多细节，请参阅 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)。

## 引用模型
有时我们会声明重复模型，或多次复用同一模型。

通过引用模型，可以为模型命名，并通过名称在不同地方引用。

先看一个简单场景：

假设用于登录的控制器共享同一模型。

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

我们可以将模型提取成变量并复用。

```typescript twoslash
import { Elysia, t } from 'elysia'

// 假设在不同文件，如 models.ts
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

这种关注点分离方式有效，但随着项目复杂度提升，我们可能在不同控制器多处复用多个模型。

可通过创建“引用模型”解决，命名模型并在 `schema` 直接使用名称引用，同时通过 `model` 注册模型。

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
        // 使用已注册的模型名称，享受自动补全
        body: 'sign',
        response: 'sign'
    })
```

若需访问模型集合，可将 `model` 定义成插件，导出时提供一组模型，避免多次导入。

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

在主程序中：

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
        // 使用已注册的模型名称，享受自动补全
        body: 'sign',
        response: 'sign'
    })
```

这种方式不仅实现关注点分离，还能多处复用模型，并将模型整合进 OpenAPI 文档。

### 多模型
`model` 接受一个对象，键为模型名，值为模型定义，支持注册多个模型。

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

### 命名规范
重复模型名称会导致 Elysia 抛错。为避免声明重复命名模型，推荐采用命名规范。

假设将所有模型存储于 `models/<name>.ts` 并在模型名前加前缀作为命名空间。

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

这在一定程度上避免命名冲突，最终仍需团队统一命名方案。

Elysia 提供意见化选项，帮助避免决策疲劳。

### TypeScript
我们可以通过访问每个 Elysia/TypeBox 类型的 `static` 属性，获取其类型定义：

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
````

<br>
<br>
<br>

这允许 Elysia 自动推断并提供类型，减少重复声明模式的需求。

一个 Elysia/TypeBox 模式可被用于：
- 运行时验证
- 数据强制转换
- TypeScript 类型
- OpenAPI 模式

使我们能够将模式作为**单一可信源**。