---
url: 'https://elysiajs.com/patterns/typebox.md'
---

# TypeBox (Elysia.t)

以下是使用 `Elysia.t` 编写验证类型的常见模式。

## 基本类型

TypeBox API 是围绕 TypeScript 类型设计的，并与之类似。

有许多熟悉的名称和行为与 TypeScript 对应项交叉，例如 **String**、**Number**、**Boolean** 和 **Object**，以及更高级的功能，如 **Intersect**、**KeyOf** 和 **Tuple**，以增强灵活性。

如果你熟悉 TypeScript，创建 TypeBox 模式的行为就像编写 TypeScript 类型一样，只是它在运行时提供实际的类型验证。

要创建第一个模式，从 Elysia 导入 **Elysia.t**，并从最基本的类型开始：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

这段代码告诉 Elysia 验证传入的 HTTP 主体，确保主体是一个字符串。如果它是字符串，则可以在请求管道和处理程序中流动。

如果形状不匹配，将抛出错误到 [错误生命周期](/essential/life-cycle.html#on-error)。

![Elysia 生命周期](/assets/lifecycle-chart.svg)

### 基本类型

TypeBox 提供具有与 TypeScript 类型相同行为的基本原始类型。

以下表格列出了最常见的基本类型：

```typescript
t.String()
```

```typescript
string
```

```typescript
t.Number()
```

```typescript
number
```

```typescript
t.Boolean()
```

```typescript
boolean
```

```typescript
t.Array(
    t.Number()
)
```

```typescript
number[]
```

```typescript
t.Object({
    x: t.Number()
})
```

```typescript
{
    x: number
}
```

```typescript
t.Null()
```

```typescript
null
```

```typescript
t.Literal(42)
```

```typescript
42
```

Elysia 扩展了来自 TypeBox 的所有类型，允许你引用 TypeBox 中的大多数 API 以供在 Elysia 中使用。

有关 TypeBox 支持的其他类型，请参见 [TypeBox 的类型](https://github.com/sinclairzx81/typebox#json-types)。

### 属性

TypeBox 可以接受基于 JSON Schema 7 规范的参数，以实现更全面的行为。

```typescript
t.String({
    format: 'email'
})
```

```typescript
saltyaom@elysiajs.com
```

```typescript
t.Number({
    minimum: 10,
    maximum: 100
})
```

```typescript
10
```

```typescript
t.Array(
    t.Number(),
    {
        /**
         * 最小项数量
         */
        minItems: 1,
        /**
         * 最大项数量
         */
        maxItems: 5
    }
)
```

```typescript
[1, 2, 3, 4, 5]
```

```typescript
t.Object(
    {
        x: t.Number()
    },
    {
        /**
         * @default false
         * 接受未在模式中指定的其他属性
         * 但仍然匹配类型
         */
        additionalProperties: true
    }
)
```

```typescript
x: 100
y: 200
```

有关每个属性的更多解释，请参见 [JSON Schema 7 规范](https://json-schema.org/draft/2020-12/json-schema-validation)。

## 荣誉提及

以下是创建模式时常见的有用模式。

### 联合类型

允许 `t.Object` 中的字段具有多种类型。

```typescript
t.Union([
    t.String(),
    t.Number()
])
```

```typescript
string | number
```

```
Hello
123
```

### 可选类型

允许 `t.Object` 中的字段为未定义或可选。

```typescript
t.Object({
    x: t.Number(),
    y: t.Optional(t.Number())
})
```

```typescript
{
    x: number,
    y?: number
}
```

```typescript
{
    x: 123
}
```

### 部分类型

允许 `t.Object` 中的所有字段为可选。

```typescript
t.Partial(
    t.Object({
        x: t.Number(),
        y: t.Number()
    })
)
```

```typescript
{
    x?: number,
    y?: number
}
```

```typescript
{
    y: 123
}
```

## Elysia 类型

`Elysia.t` 建立在 TypeBox 之上，进行了预配置以便于服务器使用，提供了在服务器端验证中常见的额外类型。

你可以在 `elysia/type-system` 中找到 Elysia 类型的所有源代码。

以下是 Elysia 提供的类型：

### 联合枚举

`UnionEnum` 允许值是指定的值之一。

```typescript
t.UnionEnum(['rapi', 'anis', 1, true, false])
```

### 文件

单个文件，通常用于 **文件上传** 验证。

```typescript
t.File()
```

文件扩展了基本模式的属性，并具有如下附加属性：

#### 类型

指定文件的格式，如图像、视频或音频。

如果提供了一个数组，它将尝试验证任何格式是否有效。

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

### 文件数组

从 [文件](#file) 扩展，但增加了对单个字段中的文件数组的支持。

```typescript
t.Files()
```

文件数组扩展了基本模式、数组和文件的属性。

### Cookie

从对象类型扩展的 Cookie Jar 的类对象表示。

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie 扩展 [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) 和 [Cookie](https://github.com/jshttp/cookie#options-1) 的属性，并具有如下附加属性：

#### secrets

用于签名 Cookie 的秘密密钥。

接受字符串或字符串数组。

```typescript
secrets?: string | string[]
```

如果提供了一个数组，将使用 [密钥轮换](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation)。新签名的值将使用第一个秘密作为密钥。

### 可为空

允许值为 null 但不为 undefined。

```typescript
t.Nullable(t.String())
```

### 允许空值

允许值为 null 和 undefined。

```typescript
t.MaybeEmpty(t.String())
```

有关其他信息，你可以在 [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system/index.ts) 中找到完整的类型系统源代码。

### 表单

对我们的 `t.Object` 进行语法糖处理，支持验证 [表单](/essential/handler.html#formdata)（FormData） 的返回值。

```typescript
t.Form({
	someValue: t.File()
})
```

### UInt8Array

接受可以被解析为 `Uint8Array` 的缓冲区。

```typescript
t.UInt8Array()
```

当你想接受可以被解析为 `Uint8Array` 的缓冲区时非常有用，例如二进制文件上传。它设计用于配合 `arrayBuffer` 解析器验证请求体，以强制请求体类型。

### ArrayBuffer

接受可以被解析为 `ArrayBuffer` 的缓冲区。

```typescript
t.ArrayBuffer()
```

当你想接受可以被解析为 `Uint8Array` 的缓冲区时非常有用，例如二进制文件上传。它设计用于配合 `arrayBuffer` 解析器验证请求体，以强制请求体类型。

### ObjectString

接受可以被解析为对象的字符串。

```typescript
t.ObjectString()
```

当你想接受可以被解析为对象的字符串但环境不支持显式传递时非常有用，比如查询字符串、请求头或 FormData 请求体。

### BooleanString

接受可以被解析为布尔值的字符串。

类似于 [ObjectString](#objectstring)，当你想接受可以被解析为布尔值的字符串但环境不支持显式传递时非常有用。

```typescript
t.BooleanString()
```

### Numeric

Numeric 接受数字字符串或数字，然后将值转换为数字。

```typescript
t.Numeric()
```

当传入值是数字字符串时非常有用，例如路径参数或查询字符串。

Numeric 支持与 [Numeric 实例](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num) 相同的属性。

## Elysia 行为

Elysia 默认使用 TypeBox。

然而，为了更方便地处理 HTTP，Elysia 有一些专用类型，并且与 TypeBox 有一些行为上的不同。

## 可选类型

要使字段可选，请使用 `t.Optional`。

这将允许客户端可选地提供查询参数。此行为也适用于 `body`、`headers`。

这与 TypeBox 不同，其中可选用于标记对象字段为可选。

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

## 数字到 Numeric

默认情况下，当作为路由模式提供时，Elysia 会将 `t.Number` 转换为 [t.Numeric](#numeric)。

因为解析的 HTTP 头、查询、URL 参数总是字符串。这意味着即使值是数字，它也会被视为字符串。

Elysia 通过检查字符串值是否看起来像数字来覆盖此行为，然后在适当时进行转换。

这仅在作为路由模式使用时应用，而不在嵌套的 `t.Object` 中。

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// 转换为 t.Numeric()
			id: t.Number()
		}),
		body: t.Object({
			// 不 转换为 t.Numeric()
			id: t.Number()
		})
	})

// 不 转换为 t.Numeric()
t.Number()
```

## 布尔值到布尔字符串

类似于 [数字到数字类型](#数值到-numeric)

任何 `t.Boolean` 将转换为 `t.BooleanString`。

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// 转换为 t.BooleanString()
			id: t.Boolean()
		}),
		body: t.Object({
			// 不 转换为 t.BooleanString()
			id: t.Boolean()
		})
	})

// 不 转换为 t.BooleanString()
t.Boolean()
```
