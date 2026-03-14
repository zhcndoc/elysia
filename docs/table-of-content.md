---
title: 目录 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 目录 - ElysiaJS

  - - meta
    - name: 'description'
      content: 学习 Elysia 没有正确或有序的方法，然而，我们建议您**首先完成基础章节**，因为该章节简要涵盖了 Elysia 的大部分特性和基础，然后再跳转到其他您感兴趣的主题。一旦您完成了基础章节，您可以跳转到任何您感兴趣的主题。然而，我们建议按照章节的顺序进行，因为它可能会参考之前的章节。

  - - meta
    - property: 'og:description'
      content: 学习 Elysia 没有正确或有序的方法，然而，我们建议您**首先完成基础章节**，因为该章节简要涵盖了 Elysia 的大部分特性和基础，然后再跳转到其他您感兴趣的主题。一旦您完成了基础章节，您可以跳转到任何您感兴趣的主题。然而，我们建议按照章节的顺序进行，因为它可能会参考之前的章节。
---

<script setup>
    import Card from './components/nearl/card.vue'
    import Deck from './components/nearl/card-deck.vue'

	import TutorialLink from './components/xiao/tutorial-link.vue'
	import AronaBanner from './components/arona/arona-banner.vue'
</script>

# 目录

学习 Elysia 没有正确的方法，但我们**强烈建议**您先查看**互动教程**，以熟悉 Elysia：

<TutorialLink />
<AronaBanner />

<!--### 前提知识
虽然 Elysia 的文档设计得很友好，但我们需要建立一个基础，以便文档能集中在 Elysia 的功能上。每当我们介绍一个新概念时，会提供相关文档的链接。

为了充分利用我们的文档，建议您对 Node.js 和基本的 HTTP 有一个基本的了解。-->

## 首先推荐
在开始使用 Elysia 之前，我们强烈建议您先查看这两页内容：

<Deck>
    <Card title="关键概念" href="/key-concept">
        Elysia 的核心概念以及如何有效使用
    </Card>
    <Card title="最佳实践" href="/essential/best-practice">
        了解编写 Elysia 代码的最佳实践
    </Card>
</Deck>

### AI 技能 / 面向大型语言模型（LLMs）

Elysia 提供了 `llms.txt` 和 `skills`，供像 **Claude Code** 和 **OpenCode** 这样的 AI 代理使用，帮助您的代理更好地理解 Elysia。

```bash
bunx skills add elysiajs/skills
```

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
        下载总结的 Elysia 文档，Markdown 格式，包含提示 LLM 的参考
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
        下载完整的 Elysia 文档，Markdown 格式，单文件供 LLM 使用
    </Card>
</Deck>

## 来自其他框架？

如果您使用过其他流行框架，如 Express、Fastify 或 Hono，您会发现 Elysia 非常容易上手，仅有一些差异。

<Deck>
    <Card title="来自 Express" href="/migrate/from-express">
        Express 与 Elysia 之间的比较
    </Card>
    <Card title="来自 Fastify" href="/migrate/from-fastify">
        Fastify 与 Elysia 之间的比较
    </Card>
    <Card title="来自 Hono" href="/migrate/from-hono">
        Hono 与 Elysia 之间的比较
    </Card>
    <Card title="来自 tRPC" href="/migrate/from-trpc">
        tRPC 与 Elysia 之间的比较
    </Card>
</Deck>

## 基础章节

这里是 Elysia 的基础内容。我们强烈建议您先阅读这些页面，再跳转到其他主题：

<Deck>
    <Card title="路由" href="/essential/route">
        了解 Elysia 中路由如何工作的
    </Card>
    <Card title="处理器" href="/essential/handler">
        学习如何处理请求
    </Card>
    <Card title="验证" href="/essential/plugin">
        如何在 Elysia 中强制类型安全
    </Card>
    <Card title="生命周期" href="/essential/plugin">
        学习不同类型的生命周期
    </Card>
    <Card title="插件" href="/essential/plugin">
        学习如何通过插件扩展 Elysia
    </Card>
</Deck>

## 更多模式

如果您想探索更多 Elysia 功能，请查看：

<Deck>
    <Card title="Handler" href="/eden/overview">
    	更多关于如何发送文件、使用服务器发送事件等的模式
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		了解如何用 Elysia 创建实时应用
    </Card>
    <Card title="Eden" href="/eden/overview">
    	了解更多关于 Eden 及其有效使用方法
    </Card>
    <Card title="Open Telemetry" href="/patterns/opentelemetry">
   		了解如何使用 Open Telemetry 监控您的应用
    </Card>
    <Card title="部署到生产" href="/patterns/deploys">
        学习如何将 Elysia 部署到生产环境
    </Card>
</Deck>

## 与元框架的集成

您也可以将 Elysia 与 Next.js、Nuxt、Astro 等元框架一起使用。

<Deck>
    <Card title="Astro" href="/integrations/astro">
        Elysia 在 Astro 端点中的应用
    </Card>
    <Card title="Expo" href="/integrations/expo">
        Elysia 在 Expo API 路由中的应用
    </Card>
    <Card title="Nextjs" href="/integrations/nextjs">
        Elysia 在路由处理器中的应用
    </Card>
    <Card title="Nuxt" href="/integrations/nuxt">
        Elysia 在 Nuxt 服务器路由中的应用
    </Card>
    <Card title="SvelteKit" href="/integrations/sveltekit">
        Elysia 在 SvelteKit 端点中的应用
    </Card>
</Deck>

## 与您喜爱的工具集成

我们提供了一些流行工具的集成：

<Deck>
    <Card title="AI SDK" href="/integrations/ai-sdk">
        学习如何在 Elysia 中使用 Vercel AI SDK
    </Card>
    <Card title="更好认证" href="/integrations/better-auth">
        学习如何在 Elysia 中使用 Better Auth
    </Card>
    <Card title="Drizzle" href="/integrations/drizzle">
  		Elysia 提供与 Drizzle 的类型安全工具
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
        学习如何在 Elysia 中使用 Prisma
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		使用 JSX 创建电子邮件模板
    </Card>
</Deck>

## 社区与支持

如果您遇到困难，欢迎随时在 GitHub Discussions、Discord 和 Twitter 上向我们的社区提问。

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        ElysiaJS 官方 Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        跟踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码和开发
    </Card>
</Deck>


---

我们希望您会像我们一样热爱 Elysia！