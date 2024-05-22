---
title: Elysia 类型
head:
    - - meta
      - property: 'title'
        content: Elysia 类型 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 验证器基于 TypeBox，预配置用于服务器使用，同时提供了常见的服务器端验证所需的附加类型。

    - - meta
      - name: 'og:description'
        content: Elysia 验证器基于 TypeBox，预配置用于服务器使用，同时提供了常见的服务器端验证所需的附加类型。
---

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

# Elysia 类型

`Elysia.t` 基于 TypeBox，预配置用于服务器使用，同时提供了常见的服务器端验证所需的附加类型。

你可以在 `elysia/type-system` 中找到 Elysia 类型的所有源代码。

以下是 Elysia 提供的类型：

<Deck>
    <Card title="Numeric" href="#numeric">
        接受数字字符串或数字，并将其转换为数字值
    </Card>
    <Card title="File" href="#file">
        单个文件。通常用于<strong>文件上传</strong>验证
    </Card>
    <Card title="Files" href="#files">
        扩展自 <a href="#file">File</a>，但支持在单个字段中使用文件数组
    </Card>
    <Card title="Cookie" href="#cookie">
        Cookie Jar 的对象表示，扩展自 Object 类型
    </Card>
    <Card title="Nullable" href="#nullable">
        允许值为 null，但不允许为 undefined
    </Card>
    <Card title="Maybe Empty" href="#maybeempty">
        接受空字符串或 null 值
    </Card>
</Deck>

## Numeric

Numeric 接受数字字符串或数字，并将其转换为数字值。

```typescript
t.Numeric()
```

当传入的值是数字字符串时，例如路径参数或查询字符串，这非常有用。

Numeric 接受与 [Numeric 实例](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num)相同的属性。

## File

单个文件。通常用于<strong>文件上传</strong>验证。

```typescript
t.File()
```

File 扩展了基本模式的属性，并添加了以下额外属性：

### type

文件的格式，例如图像、视频、音频。

如果提供了数组，则会尝试验证其中任何格式是否有效。

```typescript
type?: MaybeArray<string>
```

### minSize

文件的最小大小。

接受字节或文件单位后缀的数字：

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

### maxSize

文件的最大大小。

接受字节或文件单位后缀的数字：

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### 文件单位后缀：

以下是文件单位的规范：
m：兆字节 (1048576 字节)
k：千字节 (1024 字节)

## Files

扩展自 [File](#file)，但支持在单个字段中使用文件数组。

```typescript
t.Files()
```

Files 扩展了基本模式、数组和 File 的属性。

## Cookie

Cookie Jar 的类似对象表示，扩展自 Object 类型。

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie 扩展了 [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) 和 [Cookie](https://github.com/jshttp/cookie#options-1) 的属性，并添加了以下附加属性：

### secrets

用于签名 Cookie 的密钥。

接受字符串或字符串数组。

```typescript
secrets?: string | string[]
```

如果提供了数组，将使用[密钥轮换](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation)，新签名的值将使用第一个密钥作为密钥。

## Nullable

允许值为 null，但不允许为 undefined。

```typescript
t.Nullable(t.String())
```

## MaybeEmpty

允许值为 null 和 undefined。

```typescript
t.MaybeEmpty(t.String())
```

有关更多信息，可以在 [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts) 中找到类型系统的完整源代码。
