---
title: Bearer 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Bearer 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的插件，用于检索按照 RFC6750 规定的 Bearer 令牌。通过 "bun add @elysiajs/bearer" 安装插件。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，用于检索按照 RFC6750 规定的 Bearer 令牌。通过 "bun add @elysiajs/bearer" 安装插件。
---

# Bearer 插件
用于 [elysia](https://github.com/elysiajs/elysia) 的插件，以检索 Bearer 令牌。

安装命令：
```bash
bun add @elysiajs/bearer
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'

const app = new Elysia()
    .use(bearer())
    .get('/sign', ({ bearer }) => bearer, {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.status = 400
                set.headers[
                    'WWW-Authenticate'
                ] = `Bearer realm='sign', error="invalid_request"`

                return 'Unauthorized'
            }
        }
    })
    .listen(3000)
```

该插件用于检索在 [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2) 中规定的 Bearer 令牌。

此插件不处理您服务器上的身份验证验证。相反，插件将决定权留给开发人员自行实现处理验证检查的逻辑。
