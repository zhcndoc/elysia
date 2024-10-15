---
title: JWT 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: JWT 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加 JWT（JSON Web Token）支持的插件。开始时使用 "bun add @elysiajs/jwt" 安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 添加 JWT（JSON Web Token）支持的插件。开始时使用 "bun add @elysiajs/jwt" 安装插件。
---

# JWT 插件
该插件为 Elysia 处理器添加了支持使用 JWT。

安装方法：
```bash
bun add @elysiajs/jwt
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
        auth.set({
            value: await jwt.sign(params),
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/profile',
        })

        return `以 ${auth.value} 登录`
    })
    .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
        const profile = await jwt.verify(auth.value)

        if (!profile) {
            set.status = 401
            return '未经授权'
        }

        return `你好 ${profile.name}`
    })
    .listen(3000)
```

## 配置
该插件扩展了来自 [jose](https://github.com/panva/jose) 的配置。

以下是插件接受的配置。

### name
为 `jwt` 函数注册的名称。

例如，`jwt` 函数将使用自定义名称注册。
```typescript
app
    .use(
        jwt({
            name: 'myJWTNamespace',
            secret: process.env.JWT_SECRETS!
        })
    )
    .get('/sign/:name', ({ myJWTNamespace, params }) => {
        return myJWTNamespace.sign(params)
    })
```

因为有些人可能需要在单个服务器中使用多个具有不同配置的 `jwt`，所以显式地以不同名称注册 JWT 函数是必要的。

### secret
用于签署 JWT 负载的私钥。

### schema
对 JWT 负载的类型严格验证。

---
以下是扩展自 [cookie](https://npmjs.com/package/cookie) 的配置。

### alg
@default `HS256`

签署 JWT 负载的算法。

jose 的可能属性有：
HS256
HS384
HS512
PS256
PS384
PS512
RS256
RS384
RS512
ES256
ES256K
ES384
ES512
EdDSA

### iss
发行者声明标识了根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1) 发行 JWT 的主体。

简而言之；通常是签署者的（域）名称。

### sub
主题声明标识了作为 JWT 主题的主体。

JWT 中的声明通常是关于主体的陈述，按照 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2) 的规定。

### aud
受众声明标识了 JWT 预期的接收者。

每个预期处理 JWT 的主体必须在受众声明中用一个值进行自我标识，按照 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3) 的规定。

### jtit
JWT ID 声明为 JWT 提供了一个唯一标识符，依据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)。

### nbf
"not before" 声明标识了在该时间之前 JWT 不得被接受处理，依据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)。

### exp
过期时间声明标识了在此时间或之后 JWT 不得被接受处理，依据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)。

### iat
"issued at" 声明标识了 JWT 被签发的时间。  

按照 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6) 的规定，该声明可用于确定 JWT 的年龄。

### b64
此 JWS 扩展头参数修改 JWS 负载表示和 JWS 签名输入计算，依据 [RFC7797](https://www.rfc-editor.org/rfc/rfc7797)。

### kid
提示指示用于保护 JWS 的密钥。 

此参数允许发起者明确向接收者信号更改密钥，依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4)。

### x5t
(X.509 证书 SHA-1 指纹) 头参数是 DER 编码的 X.509 证书的 base64url 编码的 SHA-1 摘要，依据 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)，且与用于数字签名 JWS 的密钥对应，依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.7)。

### x5c
(X.509 证书链) 头参数包含与用于数字签名 JWS 的密钥相对应的 X.509 公钥证书或证书链，依据 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)，以及依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.6)。

### x5u
(X.509 URL) 头参数是一个 URI [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)，它指向用于数字签名 JWS 的 X.509 公钥证书或证书链的资源，依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.5)。

### jwk
"jku" (JWK 集 URL) 头参数是一个 URI [RFC3986]，它指向 JSON 编码的公钥集合的资源，其中一个对应于用于数字签名 JWS 的密钥。

根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.2)，密钥必须编码为 JWK 集 [JWK]。

### typ
`typ` (类型) 头参数用于 JWS 应用程序声明此完整 JWS 的媒体类型 [IANA.MediaTypes]。

这旨在供应用程序使用，当一个应用程序数据结构中可能存在多种对象而可以包含 JWS，依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)。

### ctr
Content-Type 参数由 JWS 应用程序用于声明受保护内容（负载）的媒体类型 [IANA.MediaTypes]。

这旨在供应用程序使用，当 JWS 负载中可能存在多种对象，依据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)。

## 处理器
以下是添加到处理器的值。

### jwt.sign
与 JWT 使用相关的动态对象集合，由 JWT 插件注册。

类型：
```typescript
sign: (payload: JWTPayloadSpec): Promise<string>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config) 相同的值。

### jwt.verify
使用提供的 JWT 配置验证负载。

类型：
```typescript
verify(payload: string) => Promise<JWTPayloadSpec | false>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config) 相同的值。

## 模式
以下是使用该插件的常见模式。

## 设置 JWT 过期时间
默认情况下，配置传递给 `setCookie` 并继承其值。

```typescript
const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'kunikuzushi',
            exp: '7d'
        })
    )
    .get('/sign/:name', async ({ jwt, params }) => jwt.sign(params))
```

这将签署一个有效期为接下来 7 天的 JWT。
