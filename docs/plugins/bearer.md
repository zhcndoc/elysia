---
title: Bearer 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Bearer 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的插件，用于按 RFC6750 规范获取 Bearer 令牌。请先通过安装插件开始，命令为 "bun add @elysia/bearer"。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，用于按 RFC6750 规范获取 Bearer 令牌。请先通过安装插件开始，命令为 "bun add @elysia/bearer"。
---

# Bearer 插件
用于 [elysia](https://github.com/elysiajs/elysia) 的插件，用于获取 Bearer 令牌。

通过以下命令安装：
```bash
bun add @elysia/bearer
```

然后这样使用：
```typescript
import { Elysia } from 'elysia'
import { bearer } from '@elysia/bearer'

const app = new Elysia()
    .use(bearer())
    .get('/sign', ({ bearer }) => bearer, {
        beforeHandle({ bearer, set, status }) {
            if (!bearer) {
                set.headers[
                    'WWW-Authenticate'
                ] = `Bearer realm='sign', error="invalid_request"`

                return status(400, 'Unauthorized') // 未授权
            }
        }
    })
    .listen(3000)
```

该插件用于获取在 [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2) 中指定的 Bearer 令牌。

此插件不会为你的服务器处理身份验证校验。相反，插件将决定权留给开发者，让其自行实现处理验证检查的逻辑。
