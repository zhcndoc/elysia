---
title: Bearer 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Bearer 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的插件，用于获取根据 RFC6750 指定的 Bearer 令牌。首先通过 "bun add @elysiajs/bearer" 安装该插件。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，用于获取根据 RFC6750 指定的 Bearer 令牌。首先通过 "bun add @elysiajs/bearer" 安装该插件。
---

# Bearer 插件
用于 [elysia](https://github.com/elysiajs/elysia) 的插件，用于获取 Bearer 令牌。

通过以下命令安装：
```bash
bun add @elysiajs/bearer
```

然后使用它：
```typescript twoslash
import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'

const app = new Elysia()
    .use(bearer())
    .get('/sign', ({ bearer }) => bearer, {
        beforeHandle({ bearer, set, status }) {
            if (!bearer) {
                set.headers[
                    'WWW-Authenticate'
                ] = `Bearer realm='sign', error="invalid_request"`

                return status(400, 'Unauthorized')
            }
        }
    })
    .listen(3000)
```

该插件用于获取在 [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2) 中指定的 Bearer 令牌。

该插件不处理您的服务器的身份验证验证。相反，该插件将决定权留给开发人员，以便他们自己应用验证检查的逻辑。