---
title: After Response
head:
    - - meta
      - property: 'og:title'
        content: After Response - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 在响应发送给客户端后执行。建议在以下情况下使用 **After Response**。清理响应。日志记录和分析。

    - - meta
      - property: 'og:description'
        content: 在响应发送给客户端后执行。建议在以下情况下使用 **After Response**。清理响应。日志记录和分析。
---

# After Response
在响应发送给客户端后执行。

建议在以下情况下使用 **After Response**:
- 清理响应
- 日志记录和分析

## 示例
下面是一个使用响应句柄来检查用户登录的示例。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(() => {
		console.log('Response', performance.now())
	})
	.listen(3000)
```

控制台应该记录如下:

```bash
Response 0.0000
Response 0.0001
Response 0.0002
```
