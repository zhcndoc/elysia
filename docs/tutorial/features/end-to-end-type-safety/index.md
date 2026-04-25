---
title: 端到端类型安全 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 端到端类型安全 - Elysia 教程

    - - meta
      - name: 'description'
        content: Elysia 提供了后端和前端之间的端到端类型安全，无需代码生成，类似于 tRPC，使用 Eden。

    - - meta
      - property: 'og:description'
        content: Elysia 提供了后端和前端之间的端到端类型安全，无需代码生成，类似于 tRPC，使用 Eden。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Code } from 'lucide-vue-next'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/eden/overview">

# 端到端类型安全

Elysia 通过 <DocLink href="/eden/overview">Eden</DocLink> 在后端和前端之间提供端到端类型安全，**无需代码生成**，类似于 tRPC。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysia/eden'

// 后端
export const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)

// 前端
const client = treaty<typeof app>('localhost:3000')

const { data, error } = await client.get()

console.log(data) // Hello World
```

这通过从 Elysia 实例推断类型来实现，并使用类型提示为客户端提供类型安全。

请参见 <DocLink href="/eden/treaty/overview">Eden Treaty</DocLink>。

## 任务

让我们点击预览中的 <Code size="18" class="inline -translate-y-0.5" /> 图标，查看请求是如何被记录的。

</Editor>