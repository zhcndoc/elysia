---
title: 错误处理 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 错误处理 - Elysia 教程

    - - meta
      - name: 'description'
        content: 了解如何在 Elysia 中处理错误，包括自定义错误处理、错误代码和管理 Web 应用程序中异常的最佳实践。

    - - meta
      - property: 'og:description'
        content: 了解如何在 Elysia 中处理错误，包括自定义错误处理、错误代码和管理 Web 应用程序中异常的最佳实践。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/error-handling">

# 错误处理

<DocLink href="/essential/life-cycle#on-error-error-handling">onError</DocLink> 在 **抛出错误** 时被调用。

它接受与处理程序类似的 **上下文**，但包含额外的：
- error - 抛出的错误
- <DocLink href="/essential/life-cycle#error-code">code</DocLink> - 错误代码

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onError(({ code, status }) => {
		if(code === "NOT_FOUND")
			return '呃~ 你迷路了吗？'

		return status(418, "我错了！但我可爱，所以你会原谅我，对吧？")
	})
	.get('/', () => 'ok')
	.listen(3000)
```

您可以返回一个 <DocLink href="/essential/handler#status">status</DocLink> 以覆盖默认错误状态。

## 自定义错误

您可以如下提供带有 <DocLink href="/essential/life-cycle#error-code">错误代码</DocLink> 的自定义错误：

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({ // [!code ++]
		'NICHE': NicheError // [!code ++]
	}) // [!code ++]
	.onError(({ error, code, status }) => {
		if(code === 'NICHE') {
			// 类型为 NicheError
			console.log(error)

			return status(418, "我们不知道你是怎么来到这里的")
		}
	})
	.get('/', () => {
		throw new NicheError('自定义错误消息')
	})
	.listen(3000)
```

Elysia 使用 <DocLink href="/essential/life-cycle#error-code">错误代码</DocLink> 来缩小错误的类型。

建议注册自定义错误，因为 Elysia 可以缩小类型。

### 错误状态代码
您还可以通过向类添加 **status** 属性来提供自定义状态代码：

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418 // [!code ++]

	constructor(message: string) {
		super(message)
	}
}
```

如果抛出错误，Elysia 将使用此状态代码，请参见 <DocLink href="/error-handling.html#custom-status-code">自定义状态代码</DocLink>。

### 错误响应
您还可以通过提供 `toResponse` 方法直接在错误中定义自定义错误响应：

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}

	toResponse() { // [!code ++]
		return { message: this.message } // [!code ++]
	} // [!code ++]
}
```

如果抛出错误，Elysia 将使用此响应，请参见 <DocLink href="/error-handling.html#custom-error-response">自定义错误响应</DocLink>。

## 练习

现在让我们尝试扩展 Elysia 的上下文。

<template #answer>
1. 您可以通过 "NOT_FOUND" 缩小错误以覆盖 404 响应。
2. 使用带有 418 状态属性的 `.error()` 方法提供您的错误。

```typescript
import { Elysia } from 'elysia'

class YourError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		"YOUR_ERROR": YourError
	})
	.onError(({ code, status }) => {
		if(code === "NOT_FOUND")
			return "嗨，你好"
	})
	.get('/', () => {
		throw new YourError("A")
	})
	.listen(3000)
```
</template>

</Editor>