---
title: 生命周期事件
head:
    - - meta
      - property: 'og:title'
        content: 生命周期事件 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 生命周期允许我们在预定义的点拦截重要事件，从而根据需要自定义服务器的行为。

    - - meta
      - property: 'og:description'
        content: 生命周期允许我们在预定义的点拦截重要事件，从而根据需要自定义服务器的行为。
---

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

# 生命周期

建议你先阅读 [Elysia 的基本生命周期](/essential/life-cycle)，以更好地了解 Elysia 的生命周期。

Life Cycle 允许我们在预定义的点拦截重要事件，从而根据需要自定义服务器的行为。

Elysia 的生命周期事件可以用以下方式表示。
![Elysia 生命周期图](/assets/lifecycle.webp)

下面是 Elysia 中可用的请求生命周期：

<Deck>
    <Card title="Request" href="request">
        通知接收到新事件
    </Card>
    <Card title="Parse" href="parse">
        将请求体解析为 <b>Context.body</b>
    </Card>
    <Card title="Transform" href="transform">
        在验证之前修改 <b>Context</b>
    </Card>
    <Card title="Before Handle" href="before-handle">
        路由处理程序之前的自定义验证
    </Card>
    <Card title="After Handle" href="after-handle">
        将返回的值转换为新值
    </Card>
    <Card title="Map Response" href="on-error">
        将返回的值映射为响应
    </Card>
    <Card title="On Error" href="on-error">
        捕获抛出的错误
    </Card>
    <Card title="On Response" href="on-response">
        在响应发送给客户端后执行
    </Card>
    <Card title="Trace" href="trace">
        审计和捕获每个事件的时间跨度
    </Card>
</Deck>

---

每个生命周期都可以应用于以下两个方面：

1. 本地钩子 (路由)
2. 全局钩子

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，你可以将钩子内联到路由处理程序中：

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

## 全局钩子

将钩子注册到**每个**在其后的处理程序中。

要添加全局钩子，你可以使用 `.on`，后跟驼峰命名的生命周期事件：

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>Hello World</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>Hello World</h1>')
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

其他插件的事件也适用于路由，因此代码的顺序很重要。
