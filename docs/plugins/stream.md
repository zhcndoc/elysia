---
title: 流插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 流插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，添加对流响应和服务器推送事件的支持，例如 OpenAI 集成。首先通过 "bun add @elysiajs/stream" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，添加对流响应和服务器推送事件的支持，例如 OpenAI 集成。首先通过 "bun add @elysiajs/stream" 安装插件。
---

# 流插件

::: warning
此插件处于维护模式，将不再接收新功能。我们建议使用 [生成器流](/essential/handler#stream) 代替。
:::

此插件添加对流响应或向客户端发送服务器推送事件的支持。

安装命令：
```bash
bun add @elysiajs/stream
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { Stream } from '@elysiajs/stream'

new Elysia()
    .get('/', () => new Stream(async (stream) => {
        stream.send('hello')

        await stream.wait(1000)
        stream.send('world')

        stream.close()
    }))
    .listen(3000)
```

默认情况下，`Stream` 将返回 `Response`，其 `content-type` 为 `text/event-stream; charset=utf8`。

## 构造函数
以下是 `Stream` 接受的构造参数：
1. 流：
    - 自动：自动从提供的值流响应
        - Iterable
        - AsyncIterable
        - ReadableStream
        - Response
    - 手动：`(stream: this) => unknown` 或 `undefined` 的回调
2. 选项：`StreamOptions`
    - [event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event)：标识事件类型的字符串
    - [retry](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#retry)：重连时间（毫秒）

## 方法
以下是 `Stream` 提供的方法：

### send
将数据加入队列以发送回客户端

### close
关闭流

### wait
返回在提供的毫秒数后解析的 promise

### value
`ReadableStream` 的内部值

## 模式
以下是使用该插件的常见模式。
- [OpenAI](#openai)
- [获取流](#fetch-stream)
- [服务器推送事件](#server-sent-event)

## OpenAI
当参数为 `Iterable` 或 `AsyncIterable` 时，自动模式将被触发，自动将响应流返回给客户端。

以下是集成 ChatGPT 到 Elysia 的示例。

```ts
new Elysia()
    .get(
        '/ai',
        ({ query: { prompt } }) =>
            new Stream(
                openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    stream: true,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            )
    )
```

默认情况下 [openai](https://npmjs.com/package/openai) 的 chatGPT 完成返回 `AsyncIterable`，因此您应该能够将 OpenAI 包裹在 `Stream` 中。

## 获取流
您可以传递一个从返回流的端点获取的 fetch 来代理一个流。

这对于那些使用 AI 文本生成的端点非常有用，因为您可以直接代理，例如 [Cloudflare AI](https://developers.cloudflare.com/workers-ai/models/llm/#examples---chat-style-with-system-prompt-preferred)。
```ts
const model = '@cf/meta/llama-2-7b-chat-int8'
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`

new Elysia()
    .get('/ai', ({ query: { prompt } }) =>
        fetch(endpoint, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${API_TOKEN}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: '你是一个友好的助手' },
                    { role: 'user', content: prompt }
                ]
            })
        })
    )
```

## 服务器推送事件
当参数为 `callback` 或 `undefined` 时，手动模式将被触发，允许您控制流。

### 基于回调
以下是使用构造函数回调创建服务器推送事件端点的示例

```ts
new Elysia()
    .get('/source', () =>
        new Stream((stream) => {
            const interval = setInterval(() => {
                stream.send('hello world')
            }, 500)

            setTimeout(() => {
                clearInterval(interval)
                stream.close()
            }, 3000)
        })
    )
```

### 基于值
以下是使用基于值创建服务器推送事件端点的示例

```ts
new Elysia()
    .get('/source', () => {
        const stream = new Stream()

        const interval = setInterval(() => {
            stream.send('hello world')
        }, 500)

        setTimeout(() => {
            clearInterval(interval)
            stream.close()
        }, 3000)

        return stream
    })
```

基于回调和基于值的流在工作原理上相同，但语法不同以满足您的偏好。