---
title: Bearer Plugin
head:
  - - meta
    - property: 'og:title'
      content: Bearer Plugin - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Elysia 的插件，用于根据 RFC6750 规范检索 Bearer 令牌。首先通过 bun add @elysiajs/bearer 安装插件。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，用于根据 RFC6750 规范检索 Bearer 令牌。首先通过 bun add @elysiajs/bearer 安装插件。
---

# Bearer Plugin

用于从 [Elysia](https://github.com/elysiajs/elysia) 检索 Bearer 令牌的插件。

安装方式：

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

该插件用于检索在 [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2) 中指定的 Bearer token。

该插件不处理服务器的身份验证验证，而是由开发者自己决定是否应用逻辑来处理验证检查。
