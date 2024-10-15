---
title: 伊甸条约单元测试 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 伊甸条约单元测试 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: 伊甸条约是 Elysia 服务器的类对象表示，提供端到端的类型安全和显著改善的开发者体验。使用伊甸条约，我们可以从 Elysia 服务器中以完全类型安全的方式获取 API，而无需代码生成。

    - - meta
      - name: 'og:description'
        content: 伊甸条约是 Elysia 服务器的类对象表示，提供端到端的类型安全和显著改善的开发者体验。使用伊甸条约，我们可以从 Elysia 服务器中以完全类型安全的方式获取 API，而无需代码生成。
---

# 单元测试
根据 [伊甸条约配置](/eden/treaty/config.html#urlorinstance) 和 [单元测试](/patterns/unit-test)，我们可以直接将一个 Elysia 实例传递给伊甸条约，从而直接与 Elysia 服务器进行交互，而无需发送网络请求。

我们可以使用这种模式创建一个具有端到端类型安全性和类型级别测试的单元测试。

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('返回响应', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?

    })
})
```

## 类型安全测试
要执行类型安全测试，只需运行 **tsc** 来测试文件夹。

```bash
tsc --noEmit test/**/*.ts
```

这对于确保客户端和服务器的类型完整性非常有用，特别是在迁移期间。
