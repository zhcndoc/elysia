---
title: 单元测试
head:
    - - meta
      - property: 'og:title'
        content: 单元测试 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 你可以使用 `bun:test` 来创建一个使用 Elysia 进行单元测试的测试。Elysia 实例有一个 `handle` 方法，接受 `Request` 对象并返回一个 `Response` 对象，与创建 HTTP 请求相同。

    - - meta
      - name: 'og:description'
        content: 你可以使用 `bun:test` 来创建一个使用 Elysia 进行单元测试的测试。Elysia 实例有一个 `handle` 方法，接受 `Request` 对象并返回一个 `Response` 对象，与创建 HTTP 请求相同。
---

# 单元测试

作为 WinterCG 兼容的一部分，我们可以使用 Request / Response 类来测试 Elysia 服务器。

Elysia 提供了 **Elysia.handle** 方法，它接受一个 Web 标准的 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象，并返回一个 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象，模拟了一个 HTTP 请求。

Bun 包含一个内置的[测试运行器](https://bun.sh/docs/cli/test)，通过 `bun:test` 模块提供了类似 Jest 的 API，方便创建单元测试。

在项目根目录下创建 **test/index.test.ts**，内容如下：

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('return a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

然后我们可以通过运行 **bun test** 来执行测试：

```bash
bun test
```

对 Elysia 服务器的新请求必须是一个完全有效的 URL，而**不是** URL 的一部分。

请求的 URL 必须按照以下格式提供：

| URL                   | Valid |
| --------------------- | ----- |
| http://localhost/user | ✅    |
| /user                 | ❌    |

我们也可以使用其他测试库，如 Jest 或 testing library，来创建 Elysia 的单元测试。

## Eden Treaty 测试

我们可以使用 Eden Treaty 来创建一个端到端的类型安全测试，用于测试 Elysia 服务器，如下所示：

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')

const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data, error } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?
    })
})
```

参见 [Eden Treaty 单元测试](/eden/treaty/unit-test)获取设置和更多信息。
