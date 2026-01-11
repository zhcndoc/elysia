---
url: 'https://elysiajs.com/eden/test.md'
---

# Eden 测试

使用 Eden，我们可以创建具有端到端类型安全和自动补全的集成测试。

## 设置

我们可以使用 [Bun test](https://bun.sh/guides/test/watch-mode) 来创建测试。

在项目根目录下创建 **test/index.test.ts**，内容如下：

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'

import { edenTreaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/', () => 'hi')
    .listen(3000)

const api = edenTreaty<typeof app>('http://localhost:3000')

describe('Elysia', () => {
    it('返回一个响应', async () => {
        const { data } = await api.get()

        expect(data).toBe('hi')
    })
})
```

然后运行 **bun test** 来执行测试：

```bash
bun test
```

这允许我们以编程方式执行集成测试，而不是手动 fetch，同时自动支持类型检查。
