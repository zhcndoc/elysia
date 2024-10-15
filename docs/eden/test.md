---
title: Eden 测试 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden 单元测试 - ElysiaJS

  - - meta
    - name: 'description'
      content: 使用 Eden，我们可以进行单元测试，以提供端到端的类型安全和自动补全，跟踪从迁移来的类型安全

  - - meta
    - property: 'og:description'
      content: 使用 Eden，我们可以进行单元测试，以提供端到端的类型安全和自动补全，跟踪从迁移来的类型安全
---

# Eden 测试
使用 Eden，我们可以创建一个具有端到端类型安全和自动补全的集成测试。

<video mute controls>
  <source src="/eden/eden-test.mp4" type="video/mp4" />
  加载视频时出现问题
</video>

> 使用 Eden Treaty 创建测试，由 [irvilerodrigues 在 Twitter 上](https://twitter.com/irvilerodrigues/status/1724836632300265926)

## 设置
我们可以使用 [Bun test](https://bun.sh/guides/test/watch-mode) 来创建测试。

在项目目录的根部创建 **test/index.test.ts**，内容如下：

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'

import { edenTreaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/', () => 'hi')
    .listen(3000)

const api = edenTreaty<typeof app>('http://localhost:3000')

describe('Elysia', () => {
    it('返回响应', async () => {
        const { data } = await api.get()

        expect(data).toBe('hi')
    })
})
```

然后，我们可以通过运行 **bun test** 来执行测试。

```bash
bun test
```

这使我们能够以编程方式执行集成测试，而不是手动获取，同时自动支持类型检查。
