---
title: 错误提供程序
head:
    - - meta
      - property: 'title'
        content: 错误提供者 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 当验证失败时，提供自定义错误消息有两种方式。内联消息属性。使用 onError 事件。TypeBox 提供了一个额外的 "error" 属性，允许我们在字段无效时返回自定义错误消息。

    - - meta
      - name: 'og:description'
        content: 当验证失败时，提供自定义错误消息有两种方式。内联消息属性。使用 onError 事件。TypeBox 提供了一个额外的 "error" 属性，允许我们在字段无效时返回自定义错误消息。
---

# 错误提供程序

当验证失败时，有两种方式提供自定义错误消息：

1. 内联 `message` 属性
2. 使用 [onError](/life-cycle/on-error) 事件

## 消息属性

TypeBox 提供了一个额外的 `error` 属性，允许我们在字段无效时返回自定义错误消息。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World!', {
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

以下是在不同类型上使用错误属性的示例：

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

</table>

## onError

我们可以根据 [onError](/life-cycle/on-error) 事件自定义验证的行为，通过缩小错误代码调用 “**VALIDATION**”。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

缩小的错误类型将被定义为从 `elysia/error` 导入的 `ValidationError`。

**ValidationError** 暴露了一个名为 **validator** 的属性，类型为 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)，允许我们直接与 TypeBox 的功能进行交互。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.validator.Errors(error.value).First().message
    })
    .listen(3000)
```

## 错误列表

**ValidationError** 提供了一个 `ValidatorError.all` 方法，允许我们列出所有的错误原因。

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

                    // 查找特定的错误名称（路径符合 OpenAPI Schema）
					const name = error.all.find((x) => x.path === '/name')

                    // 如果存在验证错误，则记录它
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

有关 TypeBox 验证器的更多信息，请参阅 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)。
