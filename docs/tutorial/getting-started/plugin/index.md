---
title: 插件 - Elysia 教程
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 插件 - Elysia 教程

    - - meta
      - name: 'description'
        content: 学习如何在 Elysia 中使用插件，以可重用的组件和功能增强您的 Web 应用程序。

    - - meta
      - property: 'og:description'
        content: 学习如何在 Elysia 中使用插件，以可重用的组件和功能增强您的 Web 应用程序。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 插件

每个 Elysia 实例都可以通过 `use` 方法与其他实例进行即插即用。

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', '用户资料')
	.get('/settings', '用户设置')

new Elysia()
	.use(user) // [!code ++]
	.get('/', '首页')
	.listen(3000)
```

一旦应用，来自 `user` 实例的所有路由将在 `app` 实例中可用。

### 插件配置
您还可以创建一个接受参数的插件，并返回一个 Elysia 实例，以制作一个更动态的插件。

```typescript
import { Elysia } from 'elysia'

const user = ({ log = false }) => new Elysia() // [!code ++]
	.onBeforeHandle(({ request }) => {
		if (log) console.log(request)
	})
	.get('/profile', '用户资料')
	.get('/settings', '用户设置')

new Elysia()
	.use(user({ log: true })) // [!code ++]
	.get('/', '首页')
	.listen(3000)
```

## 练习

让我们将 `user` 实例应用于 `app` 实例。

<template #answer>

与上述示例类似，我们可以使用 `use` 方法将 `user` 实例插入到 `app` 实例中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/profile', '用户资料')
	.get('/settings', '用户设置')

const app = new Elysia()
	.use(user) // [!code ++]
	.get('/', '首页')
	.listen(3000)
```

</template>

</Editor>