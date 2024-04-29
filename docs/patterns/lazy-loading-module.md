---
title: 懒加载模块
head:
  - - meta
    - property: 'og:title'
      content: 懒加载模块 - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Elysia 支持懒加载模块。懒加载可以通过将模块推迟到服务器启动后逐步索引，从而帮助减少启动时间。当某些模块很重且导入启动时间至关重要时，懒加载模块是一个很好的选择。

  - - meta
    - property: 'og:description'
      content: Elysia 支持懒加载模块。懒加载可以通过将模块推迟到服务器启动后逐步索引，从而帮助减少启动时间。当某些模块很重且导入启动时间至关重要时，懒加载模块是一个很好的选择。
---

# 懒加载模块

默认情况下，模块会被急切加载。

Elysia 在启动服务器之前会加载所有模块并注册和索引它们。这确保在接受请求之前，所有模块都已加载完毕。

虽然对于大多数应用程序来说这是可以的，但对于在无服务器环境或边缘函数中运行的服务器来说，这可能成为一个瓶颈，其中启动时间很重要。

懒加载可以通过将模块推迟到服务器启动后逐步索引来帮助减少启动时间。

当某些模块很重且导入启动时间至关重要时，懒加载模块是一个很好的选择。

默认情况下，任何没有使用 await 的异步插件都被视为延迟加载模块，而 import 语句则被视为懒加载模块。

这两者都会在服务器启动后注册。

## 延迟加载模块

延迟加载模块是一个在服务器启动后可以注册的异步插件。

```typescript twoslash
// @filename: files.ts
export const loadAllFiles = async () => <string[]>[]

// @filename: plugin.ts
// ---cut---
// plugin.ts
import { Elysia } from 'elysia'
import { loadAllFiles } from './files'

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((file) => app
        .get(file, () => Bun.file(file))
    )

    return app
}
```

并在主文件中使用：

```typescript twoslash
// @filename: plugin.ts
import { Elysia } from 'elysia'

export const loadAllFiles = async () => <string[]>[]

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((file) => app
        .get(file, () => Bun.file(file))
    )

    return app
}

// @filename: index.ts
// ---cut---
// plugin.ts
import { Elysia } from 'elysia'
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

Elysia 静态插件也是一个延迟加载模块，因为它异步加载文件并注册文件路径。

## 懒加载模块

与异步插件一样，懒加载模块将在服务器启动后注册。

懒加载模块可以是同步或异步函数，只要模块与 `import` 一起使用，模块就会被懒加载。

```typescript twoslash
// @filename: plugin.ts
import { Elysia } from 'elysia'

export default new Elysia()

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

推荐在模块计算量大和/或阻塞时使用模块懒加载。

为确保在服务器启动之前模块注册完成，我们可以在延迟加载模块上使用 `await`。

## 测试

在测试环境中，我们可以使用 `await app.modules` 来等待延迟加载和懒加载模块。

```typescript twoslash
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Modules', () => {
    it('inline async', async () => {
        const app = new Elysia()
              .use(async (app) =>
                  app.get('/async', () => 'async')
              )

        await app.modules

        const res = await app
            .handle(new Request('http://localhost/async'))
            .then((r) => r.text())

        expect(res).toBe('async')
    })
})
```
