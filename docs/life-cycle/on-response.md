---
title: On Response
head:
    - - meta
      - property: 'og:title'
        content: On Response - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 在响应发送给客户端之后执行。推荐在以下情况下使用 **On Response**。清理响应、记录日志和分析。

    - - meta
      - property: 'og:description'
        content: 在响应发送给客户端之后执行。推荐在以下情况下使用 **On Response**。清理响应、记录日志和分析。
---

# Response

在响应发送给客户端之后执行。

推荐在以下情况下使用 **On Response**：
- 清理响应
- 记录日志和分析

## 示例

下面是使用响应处理程序检查用户登录的示例。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.onResponse(() => {
		console.log('Response', performance.now())
	})
	.listen(3000)
```

控制台应该记录如下内容：

```bash
Response 0.0000
Response 0.0001
Response 0.0002
```
