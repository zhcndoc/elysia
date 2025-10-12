---
title: 封装 - Elysia 教程
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 封装 - Elysia 教程

    - - meta
      - name: 'description'
        content: Elysia 钩子仅封装到其自己的实例中。如果您创建一个新实例，则不会与其他实例共享钩子。

    - - meta
      - property: 'og:description'
        content: Elysia 钩子仅封装到其自己的实例中。如果您创建一个新实例，则不会与其他实例共享钩子。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const profile1 = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => '嗨！')

const demo1 = new Elysia()
	.use(profile1)
	.patch('/rename', () => '好的！XD')

const profile2 = new Elysia()
	.onBeforeHandle(
		{ as: 'global' },
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	.patch('/rename', () => '好的！XD')

</script>

<Editor :code="code" :testcases="testcases">

# 封装

Elysia 钩子仅**封装**到其自己的实例中。

如果您创建一个新实例，则不会与其他实例共享钩子。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => '嗨！')

new Elysia()
	.use(profile)
	.patch('/rename', () => '好的！XD')
	.listen(3000)
```

<Playground :elysia="demo1" />

> 尝试在 URL 地址栏中更改路径为 **/rename** 并查看结果

<br>

**Elysia 隔离生命周期**，除非明确说明。

这类似于 JavaScript 中的 **export**，您需要导出函数才能使其可用于模块外部。

要**“导出”**生命周期到其他实例，您必须指定范围。

### 范围

有 3 种可用范围：
1. **local**（默认） - 仅适用于当前实例及其子实例
2. **scoped** - 适用于父实例、当前实例及子实例
3. **global** - 适用于应用插件的所有实例（所有父实例、当前实例和子实例）

在我们的例子中，我们希望将登录检查应用于直接父级 `app`，因此可以使用 **scoped** 或 **global**。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => '你好！')

const app = new Elysia()
	.use(profile)
	// 这里有登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="demo2" />

将生命周期转换为 **"scoped"** 将生命周期导出到 **父实例**。
而 **"global"** 将生命周期导出到 **所有具有插件的实例**。

在 <DocLink href="/essential/plugin.html#scope-level">范围</DocLink> 中了解更多关于此的信息。

## 保护
类似于生命周期，**schema** 也封装到其自己的实例中。

我们可以像生命周期一样指定保护范围。

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})
	.get('/profile', () => '嗨！')
	.get('/settings', () => '设置')
```

非常重要的是要注意，每个钩子将影响其声明**后面**的所有路由。

有关更多信息，请参见 <DocLink href="/essential/plugin.html#scope">范围</DocLink>。

## 任务

让我们为 `nameCheck` 和 `ageCheck` 定义一个范围，以使我们的应用正常工作。

<template #answer>

我们可以按如下方式修改范围：
1. 将 `nameCheck` 的范围修改为 **scope**
2. 将 `ageCheck` 的范围修改为 **global**

```typescript
import { Elysia, t } from 'elysia'

const nameCheck = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ query: { name }, status }) => {
			if(!name) return status(401)
		}
	)

const ageCheck = new Elysia()
	.guard({
		as: 'global', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})

const name = new Elysia()
	.use(nameCheck)
	.patch('/rename', () => '好的！XD')

const profile = new Elysia()
	.use(ageCheck)
	.use(name)
	.get('/profile', () => '嗨！')

new Elysia()
	.use(profile)
	.listen(3000)
```

</template>

</Editor>