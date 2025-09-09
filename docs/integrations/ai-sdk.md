---
title: 与 AI SDK 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 AI SDK 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 提供了对响应流的支持，使您能够轻松集成 Vercel AI SDK。

    - - meta
      - property: 'og:description'
        content: Elysia 提供了对响应流的支持，使您能够轻松集成 Vercel AI SDK。
---

# 与 AI SDK 集成

Elysia 提供了对响应流的支持，使您能够无缝集成 [Vercel AI SDKs](https://vercel.com/docs/ai)。

## 响应流

Elysia 支持对 `ReadableStream` 和 `Response` 的持续流式处理，允许您直接从 AI SDK 返回流。

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
    return result.textStream // [!code ++]

    // 也支持 UI 消息流
    return result.toUIMessageStream() // [!code ++]
})
```

Elysia 会自动处理流，允许您以多种方式使用它。

## 服务器发送事件（Server Sent Event）

Elysia 还支持通过简单地将 `ReadableStream` 包裹在 `sse` 函数中，实现流式响应的服务器发送事件。

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
    return sse(result.textStream) // [!code ++]

    // 也支持 UI 消息流
    return sse(result.toUIMessageStream()) // [!code ++]
})
```

## 作为响应

如果您不需要后续使用 [Eden](/eden/overview) 的流类型安全，可以直接将流作为响应返回。

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

    return result.toTextStreamResponse() // [!code ++]

    // UI 消息流响应将使用 SSE
    return result.toUIMessageStreamResponse() // [!code ++]
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

    for await (const data of result.textStream) // [!code ++]
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

如果 AI SDK 不支持您使用的模型，您仍然可以使用 `fetch` 函数向 AI SDK 发起请求并直接流式传输响应。

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

更多信息请参考 [AI SDK 文档](https://ai-sdk.dev/docs/introduction)