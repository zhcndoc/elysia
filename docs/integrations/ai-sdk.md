---
title: 与 AI SDK 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 AI SDK 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 轻松支持响应流，允许您无缝集成 Vercel AI SDK。

    - - meta
      - property: 'og:description'
        content: Elysia 轻松支持响应流，允许您无缝集成 Vercel AI SDK。
---

# 与 AI SDK 集成

Elysia 轻松支持响应流，允许您无缝集成 [Vercel AI SDKs](https://vercel.com/docs/ai)。

## 响应流

Elysia 支持持续流式传输 `ReadableStream` 和 `Response`，允许您直接从 AI SDK 返回流。

```ts
import { Elysia } from 'elysia'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: '你是《原神》中的八重神子',
        prompt: '嗨！你近来怎么样？'
    })

    // 直接返回一个 ReadableStream
    return stream.textStream // [!code ++]

    // 也支持 UI 消息流
    return stream.toUIMessageStream() // [!code ++]
})
```

Elysia 会自动处理流，允许您以多种方式使用它。

## 服务器发送事件（Server-Sent Events）

Elysia 还支持通过简单地使用 `sse` 函数包装 `ReadableStream` 来实现流式响应。

```ts
import { Elysia, sse } from 'elysia' // [!code ++]
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: '你是《原神》中的八重神子',
        prompt: '嗨！你近来怎么样？'
    })

    // 每个数据块都会作为服务器发送事件发送
    return sse(stream.textStream) // [!code ++]

    // 也支持 UI 消息流
    return sse(stream.toUIMessageStream()) // [!code ++]
})
```

## 作为响应

如果您不需要流的类型安全以供后续与 [Eden](/eden/overview) 使用，可以直接将流作为响应返回。

```ts
import { Elysia } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: '你是《原神》中的八重神子',
        prompt: '嗨！你近来怎么样？'
    })

    return stream.toTextStreamResponse() // [!code ++]

    // UI 消息流响应将使用 SSE
    return stream.toUIMessageStreamResponse() // [!code ++]
})
```

## 手动流式处理

如果您想对流过程有更多控制，可以使用生成器函数手动产出数据块。

```ts
import { Elysia, sse } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', async function* () {
    const stream = streamText({
        model: openai('gpt-5'),
        system: '你是《原神》中的八重神子',
        prompt: '嗨！你近来怎么样？'
    })

    for await (const data of stream.textStream) // [!code ++]
        yield sse({ // [!code ++]
            data, // [!code ++]
            event: 'message' // [!code ++]
        }) // [!code ++]

    yield sse({
        event: 'done'
    })
})
```

## 使用 Fetch

如果 AI SDK 不支持您所用的模型，您仍然可以使用 `fetch` 函数向 AI SDK 发送请求，并直接流式传输响应。

```ts
import { Elysia, fetch } from 'elysia'

new Elysia().get('/', () => {
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-5',
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: '你是《原神》中的八重神子'
                },
                { role: 'user', content: '嗨！你近来怎么样？' }
            ]
        })
    })
})
```

Elysia 会自动代理带有流支持的 fetch 响应。

---

如需更多信息，请参阅 [AI SDK 文档](https://ai-sdk.dev/docs/introduction)
