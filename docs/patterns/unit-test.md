---
title: 测试 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 测试 - ElysiaJS

    - - meta
      - name: 'description'
        content: 您可以使用 `bun:test` 创建与 Elysia 的单元测试。Elysia 实例具有一个 `handle` 方法，它接受 `Request` 并返回 `Response`，与创建 HTTP 请求相同。

    - - meta
      - name: 'og:description'
        content: 您可以使用 `bun:test` 创建与 Elysia 的单元测试。Elysia 实例具有一个 `handle` 方法，它接受 `Request` 并返回 `Response`，与创建 HTTP 请求相同。
---

# 单元测试

作为 WinterCG 的合规实现，我们可以使用 Request/Response 类来测试 Elysia 服务器。

Elysia 提供了 **Elysia.handle** 方法，该方法接受 Web 标准 [Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 并返回 [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)，模拟 HTTP 请求。

Bun 包含一个内置的 [测试运行器](https://bun.sh/docs/cli/test)，通过 `bun:test` 模块提供类似 Jest 的 API，便于创建单元测试。

在项目根目录下创建 **test/index.test.ts**，内容如下：

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('returns a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

然后我们可以通过运行 **bun test** 来进行测试。

```bash
bun test
```

对 Elysia 服务器的新请求必须是一个完全有效的 URL，**不能**是 URL 的一部分。

请求必须提供如下格式的 URL：

| URL                   | 有效 |
| --------------------- | ----- |
| http://localhost/user | ✅    |
| /user                 | ❌    |

我们还可以使用其他测试库，如 Jest 或其他测试库来创建 Elysia 单元测试。

## Eden Treaty 测试

我们可以使用 Eden Treaty 创建 Elysia 服务器的端到端类型安全测试，如下所示：

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')

const api = treaty(app)

describe('Elysia', () => {
    it('returns a response', async () => {
        const { data, error } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?
    })
})
```

有关设置和更多信息，请参阅 [Eden Treaty 单元测试](/eden/treaty/unit-test)。
