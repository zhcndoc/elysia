---
title: 重新映射
head:
  - - meta
    - property: 'og:title'
      content: 重新映射 - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: 重新映射 `state`、`decorate`、`model`、`derive`，以防止名称冲突或重命名属性

  - - meta
    - property: 'og:description'
      content: 重新映射 `state`、`decorate`、`model`、`derive`，以防止名称冲突或重命名属性
---

# 重新映射

顾名思义，这允许我们将现有的 `state`、`decorate`、`model`、`derive` 重新映射为我们想要的任何内容，以防止名称冲突，或者只是想要重命名一个属性。

通过将函数作为第一个参数提供，回调函数将接受当前值，使我们能够将值重新映射为我们想要的任何内容。

```ts
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // 排除 b state
    .state(({ b, ...rest }) => rest)
```

当你需要处理一个具有一些重复名称的插件时，这非常有用，允许你重新映射插件的名称：

```ts
new Elysia()
    .use(
        plugin
            .decorate(({ logger, ...rest }) => ({
                pluginLogger: logger,
                ...rest
            }))
    )
```

重新映射函数可以用于 `state`、`decorate`、`model`、`derive`，帮助你定义正确的属性名称并防止名称冲突。

## 附加词

为了提供更流畅的体验，一些插件可能有很多属性值，逐个重新映射可能会让人感到不知所措。

**附加词**函数由**前缀**和**后缀**组成，允许我们轻松地重新映射实例的所有属性，防止插件名称冲突。

```ts
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

默认情况下，**附加词**会自动处理运行时和类型级别的代码，将属性重新映射为驼峰命名约定。

在某些情况下，你还可以重新映射插件的 `all` 属性：

```ts
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```
