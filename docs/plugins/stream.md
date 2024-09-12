---
title: Stream Plugin
head:
    - - meta
      - property: 'og:title'
        content: Stream Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for streaming response and Server-Sent Events, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/stream".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for streaming response and Server-Sent Events, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/stream".
---

# Stream Plugin

::: warning
此插件处于维护模式，不会接收新功能。我们建议使用[生成器流](/patterns/stream)
:::

这个插件为客户端添加了流响应或发送服务器推送事件的支持。

安装方法：
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

默认情况下，`Stream` 将返回具有 `content-type` 为 `text/event-stream; charset=utf8` 的 `Response`。

## 构造函数
以下是 `Stream` 接受的构造函数参数：
1. Stream:
    - 自动流：自动从提供的值流式传输响应
        - 可迭代对象
        - 异步可迭代对象
        - 可读流
        - 响应对象
    - 手动流：回调函数 `(stream: this) => unknown` 或 `undefined`
2. 选项：`StreamOptions`
    - [event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event)：描述事件类型的字符串
    - [retry](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#retry)：重连时间 (毫秒)

## 方法
以下是 `Stream` 提供的方法：

### send
将数据加入到流中以发送回客户端

### close
关闭流

### wait
返回一个在指定的时间值 (以毫秒为单位) 后解析的 Promise

### value
`ReadableStream` 的内部值

## 示例
以下是使用该插件的常见模式。
- [OpenAI](#openai)
- [Fetch Stream](#fetch-stream)
- [Server Sent Event](#server-sent-event)

## OpenAI
当参数为 `Iterable` 或 `AsyncIterable` 时，将会自动触发自动模式，自动将响应流式传输到客户端。

下面是将 ChatGPT 集成到 Elysia 中的示例。

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

默认情况下，[openai](https://npmjs.com/package/openai) 的 ChatGPT 完成返回 `AsyncIterable`，因此您应该能够将 OpenAI 包装在 `Stream` 中。

## Fetch Stream
您可以传递一个从返回流的端点获取的 fetch，以代理流。

这对于那些使用 AI 文本生成的端点非常有用，因为您可以直接代理它，例如：[Cloudflare AI](https://developers.cloudflare.com/workers-ai/models/llm/#examples---chat-style-with-system-prompt-preferred)。

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
                    { role: 'system', content: 'You are a friendly assistant' },
                    { role: 'user', content: prompt }
                ]
            })
        })
    )
```

## Server Sent Event
当参数为 `callback` 或 `undefined` 时，将会触发手动模式，允许您控制流。

### 基于回调的
以下是使用构造函数回调创建服务器推送事件端点的示例。

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

### 基于值的
以下是使用值为基础创建服务器推送事件端点的示例。

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

基于回调和基于值的流工作方式相同，只是语法不同，可根据个人偏好选择其中一种方法。