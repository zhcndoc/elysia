---
url: 'https://elysiajs.com/plugins/bearer.md'
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
