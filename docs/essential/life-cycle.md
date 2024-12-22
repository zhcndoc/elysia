---
title: 生命周期 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - ElysiaJS

    - - meta
      - name: 'description'
        content: 生命周期事件是Elysia处理每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截和监听这些事件的循环。钩子允许你转化通过数据管道运行的数据。借助钩子，你可以将Elysia自定义到最大化潜力。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是Elysia处理每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截和监听这些事件的循环。钩子允许你转化通过数据管道运行的数据。借助钩子，你可以将Elysia自定义到最大化潜力。
---

<script setup>
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'
</script>

# 生命周期

生命周期允许我们在预定义的点拦截一个重要事件，从而根据需要自定义我们服务器的行为。

Elysia的生命周期事件可以表示如下：
![Elysia 生命周期图](/assets/lifecycle.webp)

以下是Elysia中可用的请求生命周期：

<Deck>
    <Card title="请求" href="#request">
        通知新事件已被接收
    </Card>
    <Card title="解析" href="#parse">
        将主体解析为 <b>Context.body</b>
    </Card>
    <Card title="转换" href="#transform">
        在验证之前修改 <b>Context</b>
    </Card>
    <Card title="处理前" href="#before-handle">
        在路由处理器之前进行自定义验证
    </Card>
    <Card title="处理后" href="#after-handle">
        将返回值转换为新值
    </Card>
    <Card title="映射响应" href="#map-response">
        将返回值映射为响应
    </Card>
    <Card title="出错时" href="#on-error">
        捕获抛出的错误
    </Card>
    <Card title="响应后" href="#after-response">
        在发送响应给客户端后执行
    </Card>
    <Card title="追踪" href="/patterns/trace">
        审计并捕获每个事件的持续时间
    </Card>
</Deck>

## 为什么
想象一下，我们想返回一些HTML。

我们需要将**"Content-Type"**头设置为**"text/html"**，以便浏览器能够渲染HTML。

如果有很多处理程序，比如大约200个端点，明确指定响应是HTML可能会变得重复。

这可能导致大量重复代码，仅仅是为了指定**"text/html"** **"Content-Type"**。

但是如果在我们发送响应后，检测到响应是一个HTML字符串，然后自动附加头部呢？

这就是生命周期概念发挥作用的地方。

## 钩子

我们将每个拦截生命周期事件的函数称为**"钩子"**，因为该函数挂钩到生命周期事件。

钩子可以分为两种类型：

1. 本地钩子：在特定路由上执行
2. 拦截器钩子：在每个路由上执行

::: tip
钩子将接受与处理程序相同的上下文，你可以想象在特定点添加一个路由处理程序。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，可以将钩子内联到路由处理程序中：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径 | 内容类型              |
| ---- | --------------------- |
| /    | text/html; charset=utf8 |
| /hi  | text/plain; charset=utf8 |

## 拦截器钩子

将钩子注册到当前实例的每个处理程序后。

要添加拦截器钩子，可以使用`.on`后跟生命周期事件的camelCase：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>你好，世界</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>你好，世界</h1>')
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径  | 内容类型              |
| ----- | --------------------- |
| /     | text/html; charset=utf8 |
| /hi   | text/html; charset=utf8 |
| /none | text/plain; charset=utf8 |

其他插件的事件也适用于该路由，因此代码的顺序很重要。

::: tip
上面的代码仅适用于当前实例，不适用于父实例。

请参阅[作用域](/essential/plugin#scope)以了解原因。
:::

## 代码顺序

Elysia的生命周期代码顺序非常重要。

Elysia的生命周期事件存储为队列，即先进先出。因此，Elysia将**始终**尊重从上到下的代码顺序，后面跟随生命周期事件的顺序。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log('1')
    })
    .onAfterHandle(() => {
        console.log('3')
    })
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('2')
        }
    })
    .listen(3000)
```

控制台应记录如下：

```bash
1
2
3
```

## 请求
每个新请求接收到的第一个生命周期事件是`onRequest`。

由于`onRequest`旨在提供最关键的上下文以减少开销，建议在以下场景中使用：
- 缓存
- 速率限制 / IP/区域锁定
- 分析
- 提供自定义头部，例如CORS

#### 示例
下面是一个伪代码，强制限制某个IP地址的速率。
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set, error }) => {
        if(rateLimiter.check(ip))
            return error(420, '请冷静下来')
    })
    .get('/', () => 'hi')
    .listen(3000)
```

如果从`onRequest`返回一个值，则该值将用作响应，其余的生命周期将被跳过。

### 预上下文
请求的上下文类型为`PreContext`，它是`Context`的一个最小表示，包含以下属性：
请求: `Request`
- set: `Set`
- store
- decorators

上下文不提供`derived`值，因为推导是基于`onTransform`事件的。

## 解析
解析是Express中**主体解析器**的等价物。

一个解析主体的函数，返回值将附加到`Context.body`，如果没有，Elysia将继续迭代通过`onParse`分配的其他解析函数，直到主体被赋值或所有解析器都执行完毕。

默认情况下，Elysia将解析以下内容类型的主体：
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用`onParse`事件提供Elysia未提供的自定义主体解析器。

#### 示例
以下是一个示例代码，通过自定义头部获取值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

返回的值将被分配给Context.body。如果没有，Elysia将继续从**onParse**堆栈中迭代其他解析函数，直到主体被赋值或所有解析器都执行完毕。

### 上下文
`onParse`的上下文扩展自`Context`，并具有以下附加属性：
- contentType: 请求的Content-Type头

所有上下文基于正常上下文，可以像正常上下文一样在路由处理程序中使用。

### 显式主体

默认情况下，Elysia将尝试提前确定主体解析函数，并选择最合适的函数以加快过程。

Elysia能够通过读取`body`来确定该主体函数。

看看这个例子：
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Elysia读取主体模式，发现该类型完全是一个对象，因此主体可能是JSON。Elysia会提前选择JSON主体解析函数，并尝试解析主体。

以下是Elysia用于选择主体解析器类型的标准：

- `application/json`: 主体类型为`t.Object`
- `multipart/form-data`: 主体类型为`t.Object`，并且有一层深度为`t.File`
- `application/x-www-form-urlencoded`: 主体类型为`t.URLEncoded`
- `text/plain`: 其他原始类型

这使Elysia能够提前优化主体解析器，并减少编译时间的开销。

### 显式内容类型
然而，在某些场景中，如果Elysia未能选择正确的主体解析函数，我们可以通过指定`type`明确告诉Elysia使用某个函数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        // 应用程序/json的简写
        type: 'json',
    })
```

允许我们控制Elysia选择主体解析函数的行为，以适应我们在复杂场景中的需求。

`type`可以是以下之一：
```typescript
type ContentType = |
    // 'text/plain'的简写
    | 'text'
    // 'application/json'的简写
    | 'json'
    // 'multipart/form-data'的简写
    | 'formdata'
    // 'application/x-www-form-urlencoded'的简写
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

## 转换
在**验证**过程之前执行，旨在修改上下文以符合验证或附加新值。

建议在以下情况下使用转换：
- 修改现有上下文以符合验证。
- `derive`基于`onTransform`提供类型支持。

#### 示例
以下是使用转换将参数转变为数字值的示例。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if(!Number.isNaN(id))
                params.id = id
        }
    })
    .listen(3000)
```

## 推导
旨在在验证过程之前直接将新值附加到上下文，存储在与**transform**相同的堆栈中。

与在服务器启动之前分配值的**state**和**decorate**不同，**derive**在每次请求发生时分配属性。允许我们将一小段信息提取为属性。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

因为**derive**在新请求开始时被分配，**derive**可以访问请求属性，如**headers**、**query**、**body**，而**store**和**decorate**无法。

与**state**和**decorate**不同，通过**derive**分配的属性是唯一的，并且不会与另一个请求共享。

### 队列
`derive`和`transform`存储在同一个队列中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derive(() => {
        console.log(2)

        return {}
    })
```

控制台应该记录如下：

```bash
1
2
```

## 处理前

在验证后并在主要路由处理程序之前执行。

旨在提供自定义验证，以满足特定需求，再运行主要处理程序。

如果返回了一个值，则将跳过路由处理程序。

建议在以下情况下使用处理前：

-   访问限制检查：授权、用户登录
-   自定义请求要求超过数据结构

#### 示例

以下是使用处理前检查用户登录状态的示例。

```typescript
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session }, error }) {
            if (!validateSession(session.value))
                return error(401)
        }
    })
    .listen(3000)
```

响应应该列出如下：

| 是否登录 | 响应         |
| -------- | ------------ |
| ❌       | 未授权      |
| ✅       | 你好        |

### 守卫

当我们需要将相同的处理前应用于多个路由时，我们可以使用 `guard` 将相同的处理前应用于多个路由。

```typescript
import { Elysia } from 'elysia'
import {
    signUp,
    signIn,
    validateSession,
    isUserExists
} from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session }, error }) {
                if (!validateSession(session.value))
                    return error(401)
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
    .listen(3000)
```

## 解析

一个“安全”的版本，即[derive](#derive)。

旨在在验证过程后向上下文附加新值，存储在与**beforeHandle**相同的堆栈中。

解析的语法与[derive](#derive)相同，下面是一个示例，从Authorization插件检索bearer头。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

使用`resolve`和`onBeforeHandle`存储在同一个队列中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .resolve(() => {
        console.log(2)

        return {}
    })
    .onBeforeHandle(() => {
        console.log(3)
    })
```

控制台应该记录如下：

```bash
1
2
3
```

与**derive**相同，通过**resolve**分配的属性是唯一的，并且不会与另一个请求共享。

### 守卫解析

由于本地钩子中不可用，因此建议使用守卫来封装**resolve**事件。

```typescript
import { Elysia } from 'elysia'
import { isSignIn, findUserById } from './user'

new Elysia()
    .guard(
        {
            beforeHandle: isSignIn
        },
        (app) =>
            app
                .resolve(({ cookie: { session } }) => ({
                    userId: findUserById(session.value)
                }))
                .get('/profile', ({ userId }) => userId)
    )
    .listen(3000)
```

## 处理后

在主要处理程序之后执行，用于将**处理前**和**路由处理程序**返回的值映射为合适的响应。

建议在以下情况下使用处理后：

-   将请求转换为新值，例如压缩、事件流
-   根据响应值添加自定义头部，例如**Content-Type**

#### 示例

以下是使用处理后向响应头添加HTML内容类型的示例。

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径 | 内容类型              |
| ---- | --------------------- |
| /    | text/html; charset=utf8 |
| /hi  | text/plain; charset=utf8 |

### 返回值

如果一个值被返回，处理后将使用返回值作为新响应值，除非该值是**未定义**。

上述示例可以重写如下：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

与**处理前**不同，从**处理后**返回一个值后，**处理后**的迭代**不会**被跳过。

### 上下文

`onAfterHandle`的上下文扩展自`Context`，并具有额外的属性`response`，这是返回给客户端的响应。

`onAfterHandle`的上下文基于正常上下文，可以像正常上下文一样在路由处理程序中使用。

## 映射响应

在**"处理后"**之后执行，旨在提供自定义响应映射。

建议在以下情况下使用转换：

-   压缩
-   将值映射为Web标准响应

#### 示例

以下是使用映射响应提供响应压缩的示例。

```typescript
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : response?.toString() ?? ''

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(
            Bun.gzipSync(encoder.encode(text)),
            {
                headers: {
                    'Content-Type': `${
                        isJson ? 'application/json' : 'text/plain'
                    }; charset=utf-8`
                }
            }
        )
    })
    .get('/text', () => '映射响应')
    .get('/json', () => ({ map: '响应' }))
    .listen(3000)
```

与**解析**和**处理前**类似，在返回一个值后，**映射响应**的下一次迭代将被跳过。

Elysia将自动处理**映射响应**中**set.headers**的合并过程，我们不需要担心手动将**set.headers**附加到响应中。

## 当出错时

**当出错时**是唯一一个并非总是在每个请求中执行的生命周期事件，而是仅在其他生命周期中至少抛出一次错误时执行。

旨在捕获并解决意外错误，强烈建议在以下情况下使用出错时：

-   提供自定义错误消息
-   失败保护或错误处理程序或重试请求
-   记录和分析

#### 示例

Elysia捕获处理程序中抛出的所有错误，分类错误代码，并将它们传递给`onError`中间件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('服务器正在维护中')

        return '无法到达'
    })
```

使用`onError`我们可以捕获并将错误转换为自定义错误消息。

::: tip
`onError`必须在我们想要应用它的处理程序之前被调用，这一点很重要。
:::

### 自定义404消息
例如，返回自定义404消息：

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND')
            return error(404, '找不到 :(')
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

### 上下文

`onError`的上下文扩展自`Context`，并具有以下附加属性：

-   error: 抛出的错误对象
-   code: 错误代码

### 错误代码

Elysia的错误代码包括：

-   NOT_FOUND
-   INTERNAL_SERVER_ERROR
-   VALIDATION
-   PARSE
-   UNKNOWN

默认情况下，抛出的错误代码为`unknown`。

::: tip
如果没有返回错误响应，错误将使用`error.name`返回。
:::

### 自定义错误

Elysia支持自定义错误，既有类型级别的，也有实现级别的。

要提供自定义错误代码，我们可以使用`Elysia.error`添加自定义错误代码，帮助我们轻松分类并缩小错误类型，以保证完整的类型安全和自动完成功能，如下所示：

```typescript twoslash
import { Elysia } from 'elysia'

class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch (code) {
            // 具有自动完成功能
            case 'MyError':
                // 具有类型缩小
                // 悬停查看error的类型为`CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('你好，错误')
    })
```

`error`的属性代码基于`error`的属性，这些属性将用于分类错误代码。

### 本地错误

与其他生命周期一样，我们通过守卫将错误放入[作用域](/essential/plugin.html#scope)中：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers))
                return error(401)
        },
        error({ error }) {
            return '已处理'
        }
    })
    .listen(3000)
```

## 处理后响应
在响应发送到客户端后执行。

建议在以下情况下使用**处理后响应**：
- 清理响应
- 记录和分析

#### 示例
以下是使用响应处理来检查用户登录状态的示例。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(() => {
		console.log('响应', performance.now())
	})
	.listen(3000)
```

控制台应记录如下：

```bash
响应 0.0000
响应 0.0001
响应 0.0002
```
