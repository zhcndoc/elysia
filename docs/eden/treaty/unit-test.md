---
title: Eden Treaty 单元测试 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 单元测试 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的一个类似对象的表示，提供端到端的类型安全性，以及显著改善的开发体验。使用伊甸，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的一个类似对象的表示，提供端到端的类型安全性，以及显著改善的开发体验。使用伊甸，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。
---

# 单元测试

根据 [Eden Treaty 配置](/eden/treaty/config.html#urlorinstance)和[单元测试](/patterns/unit-test)，我们可以直接将 Elysia 实例传递给 Eden Treaty，以便直接与 Elysia 服务器交互，而无需发送网络请求。

我们可以使用这种模式来创建具有端到端类型安全性和类型级测试的单元测试。

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?
    })
})
```

## 类型安全性测试

要执行类型安全性测试，只需运行 **tsc** 来测试文件夹。

```bash
tsc --noEmit test/**/*.ts
```

这对于确保客户端和服务器的类型完整性特别有用，尤其是在迁移期间。
