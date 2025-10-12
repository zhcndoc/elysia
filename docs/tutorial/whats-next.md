---
title: 下一步 - Elysia 教程
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 下一步 - Elysia 教程

    - - meta
      - name: 'description'
        content: 恭喜！您已完成教程。现在您准备好使用 Elysia 构建自己的应用程序了！我们强烈建议您在开始使用 Elysia 之前先查看这两页内容：关键概念和最佳实践。或者，您可以下载 llms.txt 或 llms-full.txt，并将其提供给您最喜欢的 LLM，例如 ChatGPT、Claude 或 Gemini，以获得更互动的体验。如果您遇到困难，请随时在 GitHub Discussions、Discord 和 Twitter 上向我们的社区提问。如果您使用过其他流行框架，如 Express、Fastify 或 Hono，您会发现 Elysia 也很上手，仅有一些小差别。我们还有必要的章节、更多模式、与 Meta 框架以及您最喜欢的工具的集成。

    - - meta
      - property: 'og:description'
        content: 恭喜！您已完成教程。现在您准备好使用 Elysia 构建自己的应用程序了！我们强烈建议您在开始使用 Elysia 之前先查看这两页内容：关键概念和最佳实践。或者，您可以下载 llms.txt 或 llms-full.txt，并将其提供给您最喜欢的 LLM，例如 ChatGPT、Claude 或 Gemini，以获得更互动的体验。如果您遇到困难，请随时在 GitHub Discussions、Discord 和 Twitter 上向我们的社区提问。如果您使用过其他流行框架，如 Express、Fastify 或 Hono，您会发现 Elysia 也很上手，仅有一些小差别。我们还有必要的章节、更多模式、与 Meta 框架以及您最喜欢的工具的集成。
---

<script setup lang="ts">
import Editor from '../components/xiao/playground/playground.vue'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import { code } from './data'
</script>

<Editor :code="code">

# 恭喜！

您已完成教程。

现在您准备好使用 Elysia 构建自己的应用程序了！

## 首先
我们强烈建议您在开始使用 Elysia 之前先查看这两页内容：

<Deck>
	<Card title="关键概念" href="/key-concept">
		Elysia 的核心概念以及如何有效运用
    </Card>
    <Card title="最佳实践" href="/essential/best-practice">
        理解编写 Elysia 代码的最佳实践
    </Card>
</Deck>

### llms.txt

或者，您可以下载 <a href="/llms.txt" download>llms.txt</a> 或 <a href="/llms-full.txt" download>llms-full.txt</a>，并将其提供给您最喜欢的 LLM，例如 ChatGPT、Claude 或 Gemini，以获得更互动的体验。

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
   		下载以 Markdown 格式总结的 Elysia 文档，包含提示 LLM 的参考
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
  		下载以 Markdown 格式的完整 Elysia 文档，便于为 LLM 提供提示
    </Card>
</Deck>

### 如果您遇到困难

请随时在 GitHub Discussions、Discord 和 Twitter 上向我们的社区提问。

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        官方 ElysiaJS Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        跟踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码和开发
    </Card>
</Deck>

## 来自其他框架？

如果您使用过其他流行框架，如 Express、Fastify 或 Hono，您会发现 Elysia 也很上手，仅有一些小差别。

<Deck>
	<Card title="从 Express" href="/migrate/from-express">
		tRPC 与 Elysia 之间的比较
	</Card>
    <Card title="从 Fastify" href="/migrate/from-fastify">
  		Fastify 与 Elysia 之间的比较
    </Card>
    <Card title="从 Hono" href="/migrate/from-hono">
  		tRPC 与 Elysia 之间的比较
    </Card>
    <Card title="从 tRPC" href="/migrate/from-trpc">
  		tRPC 与 Elysia 之间的比较
    </Card>
</Deck>

## 重要章节

以下是 Elysia 的基础知识，我们强烈建议您在跳转到其他主题之前先浏览这些页面：

<Deck>
	<Card title="路由" href="/essential/route">
  理解 Elysia 中路由的工作原理
	</Card>
	<Card title="处理程序" href="/essential/handler">
  		了解如何处理请求
	</Card>
	<Card title="验证" href="/essential/plugin">
		如何在 Elysia 中执行类型安全
	</Card>
	<Card title="生命周期" href="/essential/plugin">
		学习不同类型的生命周期
	</Card>
	<Card title="插件" href="/essential/plugin">
	  	学习如何使用插件扩展 Elysia
	</Card>
</Deck>

## 更多模式

如果您想探索更多 Elysia 特性，请查看：

<Deck>
    <Card title="处理程序" href="/eden/overview">
    	如何发送文件、服务器发送事件等的更多模式
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		查看如何使用 Elysia 创建实时应用程序
    </Card>
    <Card title="Eden" href="/eden/overview">
    	了解更多关于 Eden 的信息，以及如何有效使用它
    </Card>
    <Card title="开放遥测" href="/eden/opentelemetry">
   		学习如何使用开放遥测监控您的应用程序
    </Card>
    <Card title="部署到生产" href="/patterns/deploys">
    	学习如何将 Elysia 部署到生产环境
    </Card>
</Deck>

## 与 Meta 框架集成

我们还可以将 Elysia 与 Meta 框架集成，如 Nextjs、Nuxt、Astro 等。

<Deck>
	<Card title="Astro" href="/integrations/astro">
		Elysia 在 Astro 端点中的应用
	</Card>
	<Card title="Expo" href="/integrations/expo">
		Elysia 在 Expo API 路由中的应用
	</Card>
	<Card title="Nextjs" href="/integrations/nextjs">
		Elysia 在路由处理程序中的应用
	</Card>
	<Card title="Nuxt" href="/integrations/nuxt">
		Elysia 在 Nuxt 服务器路由中的应用
	</Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
		Elysia 在 SvelteKit 端点中的应用
	</Card>
</Deck>

## 与您喜欢的工具集成

我们与一些流行工具进行了集成：

<Deck>
	<Card title="AI SDK" href="/integrations/ai-sdk">
   		学习如何将 Vercel AI SDK 与 Elysia 一起使用
    </Card>
    <Card title="Better Auth" href="/integrations/better-auth">
   		学习如何将 Better Auth 与 Elysia 一起使用
    </Card>
    <Card title="Drizzle" href="/integrations/drizzle">
  		Elysia 提供了一个与 Drizzle 一起使用的类型安全工具
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
  		学习如何将 Prisma 与 Elysia 一起使用
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		我们可以使用 JSX 创建电子邮件模板
    </Card>
</Deck>

<br>

---

我们希望您会像我们一样喜爱 Elysia！

</Editor>