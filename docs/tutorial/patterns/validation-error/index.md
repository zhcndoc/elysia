---
title: 验证错误 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 验证错误 - Elysia 教程

    - - meta
      - name: 'description'
        content: 学习如何自定义 Elysia 中的验证错误消息，包括为无效输入提供详细反馈。

    - - meta
      - property: 'og:description'
        content: 学习如何自定义 Elysia 中的验证错误消息，包括为无效输入提供详细反馈。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 验证错误

如果您使用 `Elysia.t` 进行验证，可以根据未通过验证的字段提供自定义错误消息。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
					error: '年龄必须是一个数字' // [!code ++]
				})
			}, {
				error: '主体必须是一个对象' // [!code ++]
			})
		}
	)
	.listen(3000)
```

Elysia 将用您提供的自定义消息覆盖默认错误消息，请参见 <DocLink href="/patterns/error-handling.html#custom-validation-message">自定义验证消息</DocLink>。

## 验证详细信息

默认情况下，Elysia 还提供 <DocLink href="/patterns/error-handling.html#validation-detail">验证详细信息</DocLink> 来解释验证出错的原因，如下所示：

```json
{
	"type": "validation",
	"on": "params",
	"value": { "id": "string" },
	"property": "/id",
	"message": "id 必须是一个数字", // [!code ++]
	"summary": "属性 'id' 应该是：'numeric', 'number'",
	"found": { "id": "string" },
	"expected": { "id": 0 },
	"errors": [
		{
			"type": 62,
			"schema": {
				"anyOf": [
					{ "format": "numeric", "default": 0, "type": "string" },
					{ "type": "number" }
				]
			},
			"path": "/id",
			"value": "string",
			"message": "期望的联合值",
			"errors": [{ "iterator": {} }, { "iterator": {} }],
			"summary": "属性 'id' 应该是：'numeric', 'number'"
		}
	]
}
```

然而，当您提供自定义错误消息时，它将完全覆盖 <DocLink href="/patterns/error-handling.html#validation-detail">验证详细信息</DocLink>

要恢复验证详细信息，您可以将自定义错误消息包装在 <DocLink href="/patterns/error-handling.html#validation-detail">验证详细信息</DocLink> 函数中。

```typescript
import { Elysia, t, validationDetail } from 'elysia' // [!code ++]

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
					error: validationDetail('年龄必须是一个数字') // [!code ++]
				})
			}, {
				error: validationDetail('主体必须是一个对象') // [!code ++]
			})
		}
	)
	.listen(3000)
```

## 任务

让我们尝试扩展 Elysia 的上下文。

<template #answer>

我们可以通过为模式提供 `error` 属性来提供自定义错误消息。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number({
                    error: '某事' // [!code ++]
                })
			})
		}
	)
	.listen(3000)
```

</template>

</Editor>