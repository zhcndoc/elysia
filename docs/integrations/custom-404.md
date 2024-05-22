---
title: 自定义 404
head:
  - - meta
    - property: 'og:title'
      content: 自定义 404 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 你可以使用 `onError` 钩子来定义自定义的 404，以拦截 "NOT_FOUND" 事件并返回自定义响应

  - - meta
    - property: 'og:description'
      content: 你可以使用 `onError` 钩子来定义自定义的 404，以拦截 "NOT_FOUND" 事件并返回自定义响应
---

# 自定义 404

你可以使用 `onError` 钩子来定义自定义的 404：
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'NOT_FOUND')
            return new Response('Not Found :(', {
                status: 404
            })
    })
    .listen(3000)
```
