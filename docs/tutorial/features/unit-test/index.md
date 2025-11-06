---
title: 单元测试 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 单元测试 - Elysia 教程

    - - meta
      - name: 'description'
        content: Elysia 提供了一个 Elysia.fetch 函数，可以轻松测试您的应用程序。

    - - meta
      - property: 'og:description'
        content: Elysia 提供了一个 Elysia.fetch 函数，可以轻松测试您的应用程序。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Code } from 'lucide-vue-next'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 单元测试

Elysia 提供了一个 **Elysia.fetch** 函数，可以轻松测试您的应用程序。

**Elysia.fetch** 接受一个 Web 标准请求，并返回一个类似于<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank">浏览器的 fetch API</a>的响应。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')

app.fetch(new Request('http://localhost/'))
	.then((res) => res.text())
	.then(console.log)
```

这将像一个 **实际请求** 一样运行请求（不是模拟的）。

### 测试
这使我们能够在不运行服务器的情况下轻松测试我们的应用程序。

::: code-group

```typescript [Bun Test]
import { describe, it, expect } from 'bun:test'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('应该返回 Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Vitest]
import { describe, it, expect } from 'vitest'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('应该返回 Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Jest]
import { describe, it, test } from '@jest/globals'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	test('应该返回 Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

:::

请参见 <DocLink href="/patterns/unit-test.html">单元测试</DocLink>。

## 任务

让我们点击预览中的 <Code size="18" class="inline -translate-y-0.5" /> 图标，看看请求是如何被记录的。

</Editor>