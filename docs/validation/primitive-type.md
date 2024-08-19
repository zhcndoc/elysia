---
title: 原始类型
head:
    - - meta
      - property: 'title'
        content: 原始类型 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 有很多与 TypeScript 对应类型相交的熟悉名称和行为。String、Number、Boolean 和 Object 以及更高级的功能，如 Intersect、KeyOf 和 Tuple，提供了更多的灵活性。如果你熟悉 TypeScript，创建 TypeBox 模式的行为与编写 TypeScript 类型相同，只是它提供了实际的运行时类型验证。

    - - meta
      - name: 'og:description'
        content: 有很多与 TypeScript 对应类型相交的熟悉名称和行为。String、Number、Boolean 和 Object 以及更高级的功能，如 Intersect、KeyOf 和 Tuple，提供了更多的灵活性。如果你熟悉 TypeScript，创建 TypeBox 模式的行为与编写 TypeScript 类型相同，只是它提供了实际的运行时类型验证。
---

# 原始类型

TypeBox API 的设计与 TypeScript 类型类似。

有很多与 TypeScript 对应类型相交的熟悉名称和行为，例如：**String**、**Number**、**Boolean** 和 **Object**，以及更高级的功能，如 **Intersect**、**KeyOf** 和 **Tuple**，提供了更多的灵活性。

如果你熟悉 TypeScript，创建 TypeBox 模式的行为与编写 TypeScript 类型相同，只是它提供了实际的运行时类型验证。

要创建你的第一个模式，从 Elysia 中导入 `Elysia.t`，并从最基本的类型开始：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
  .post('/', ({ body }) => `Hello ${body}`, {
    body: t.String(),
  })
  .listen(3000);
```

这段代码告诉 Elysia 验证传入的 HTTP 请求体，确保请求体是字符串，如果是字符串，则允许其通过请求管道和处理程序。

如果形状不匹配，它将抛出错误，进入[错误生命周期](/essential/life-cycle.html#events)。

![Elysia 生命周期](/assets/lifecycle.webp)

## 基本类型

TypeBox 提供了与 TypeScript 类型相同行为的基本原始类型。

下表列出了最常见的基本类型：

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

Elysia 扩展了 TypeBox 的所有类型，允许你引用 TypeBox 中的大多数 API 以在 Elysia 中使用。

有关 TypeBox 支持的其他类型，请参阅 [TypeBox 的类型](https://github.com/sinclairzx81/typebox#json-types)。

## 属性

TypeBox 可以接受一个参数，以基于 JSON Schema 7 规范实现更全面的行为。

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
         * 接受未在模式中指定但仍与类型匹配的附加属性
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

有关每个属性的更多解释，请参阅 [JSON Schema 7 规范](https://json-schema.org/draft/2020-12/json-schema-validation)。

---

<br>

# Honorable Mention

以下是在创建模式时经常发现有用的常见模式。

## 联合类型

通过联合允许多种类型。

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

## 可选类型

在 `t.Object` 的属性中提供，允许字段为 undefined 或可选。

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

## 部分类型

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

## 自定义错误

TypeBox 提供了额外的 `error` 属性，允许我们返回自定义错误消息，如果字段无效。

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
