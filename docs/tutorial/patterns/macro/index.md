---
title: 宏 - Elysia 教程
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 宏 - Elysia 教程

    - - meta
      - name: 'description'
        content: 宏是可重用的路由选项。了解如何在 Elysia 中创建和使用宏，以增强您的应用程序。

    - - meta
      - property: 'og:description'
        content: 宏是可重用的路由选项。了解如何在 Elysia 中创建和使用宏，以增强您的应用程序。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 宏

可重用的路由选项。

想象一下我们有一个这样的认证检查：

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/user', ({ body }) => body, {
		cookie: t.Object({
			session: t.String()
		}),
		beforeHandle({ cookie: { session } }) {
			if(!session.value) throw '未授权'
		}
	})
	.listen(3000)
```

如果我们有多个路由需要认证，就必须重复相同的选项。

相反，我们可以使用宏来重用路由选项：

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('auth', {
		cookie: t.Object({
			session: t.String()
		}),
		// 伪认证检查
		beforeHandle({ cookie: { session }, status }) {
			if(!session.value) return status(401)
		}
	})
	.post('/user', ({ body }) => body, {
		auth: true // [!code ++]
	})
	.listen(3000)
```

**auth** 将内联 **cookie** 和 **beforeHandle** 到路由中。

简而言之，<DocLink href="/patterns/macro">宏</DocLink> **是可重用的路由选项**，类似于函数，但作为具有 **类型安全性** 的路由选项。

## 任务

让我们定义一个宏来检查一个数字是否是斐波那契数：

```typescript
function isFibonacci(n: number) {
	let a = 0, b = 1
	while(b < n) [a, b] = [b, a + b]
	return b === n || n === 0
}
```

<template #answer>

1. 为了强制类型，我们可以在宏中定义一个 `body` 属性。
2. 为了短路请求，我们可以使用 `status` 函数提前返回。

```typescript
import { Elysia, t } from 'elysia'

function isPerfectSquare(x: number) {
    const s = Math.floor(Math.sqrt(x))
    return s * s === x
}

function isFibonacci(n: number) {
    if (n < 0) return false

    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

new Elysia()
    .macro('isFibonacci', {
		body: t.Number(),
        beforeHandle({ body, status }) {
            if(!isFibonacci(body)) return status(418)
        }
    })
	.post('/fibo', ({ body }) => body, {
		isFibonacci: true
	})
    .listen(3000)
```

</template>

</Editor>