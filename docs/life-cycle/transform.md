---
title: Transform
head:
  - - meta
    - property: 'og:title'
      content: Transform - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: 执行在“验证”过程之前，旨在改变上下文以符合验证要求或附加新值。建议使用 transform 来进行以下操作：改变现有上下文以符合验证要求。

  - - meta
    - name: 'og:description'
      content: 执行在“验证”过程之前，旨在改变上下文以符合验证要求或附加新值。建议使用 transform 来进行以下操作：改变现有上下文以符合验证要求。
---

# Transform

执行在**验证**过程之前，旨在改变上下文以符合验证要求或附加新值。

建议使用 transform 来进行以下操作：

- 改变现有上下文以符合验证要求。
- `derive` 基于 `onTransform`，支持提供类型。

## 示例

以下是使用 transform 改变参数为数值的示例。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if(!Number.isNaN(id))
                params.id = id
        }
    })
    .listen(3000)
```

## Derive

设计用于在验证过程之前直接向上下文附加新值，存储在与 **transform** 相同的堆栈中。

与在服务器启动之前分配值的 **state** 和 **decorate** 不同，**derive** 在每个请求发生时分配属性。这样我们就可以将一部分信息提取到属性中。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

由于 **derive** 在每个新请求开始时分配，**derive** 可以访问请求属性，如 **headers**、**query**、**body**，而 **store** 和 **decorate** 不能。

与 **state** 和 **decorate** 不同，由 **derive** 分配的属性是唯一的，不与其他请求共享。

## Queue twoslash

使用 `derived` 和 `transform` 存储在同一个队列中。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derive(() => {
        console.log(2)

        return {}
    })
```

控制台应该按照以下顺序记录：

```bash
1
2
```
