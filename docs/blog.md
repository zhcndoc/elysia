---
title: Elysia 博客
layout: page
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 博客 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 来自核心维护者的 ElysiaJS 更新

    - - meta
      - property: 'og:description'
        content: 来自核心维护者的 ElysiaJS 更新
---

<script setup>
    import Blogs from '../components/blog/Landing.vue'
</script>

<Blogs
  :blogs="[
	  {
	    title: 'Elysia 1.1 - 成人的天堂',
	    href: '/blog/elysia-11',
	    detail: '介绍 OpenTelemetry 和 Trace v2。数据强制和规范化。Guard 插件和批量转换。可选路径参数。装饰器和响应状态对账。生成器响应流。'
	  },
      {
        title: 'Elysia 1.0 - 堕落者的哀曲',
        href: '/blog/elysia-10',
        detail: '介绍 Sucrose，一个更好的静态代码分析引擎，将启动时间提高到 14 倍，删除 40 个路由/实例限制，更快的类型推断高达 ~3.8 倍，Eden Treaty 2、Hook 类型（破坏更改），以及用于严格类型检查的内联错误。'
      },
      {
        title: '介绍 Elysia 0.8 - 史泰纳之门',
        href: '/blog/elysia-08',
        detail: '介绍 Macro API，一种与 Elysia 互动的新方式。新的生命周期、分辨率和地图响应，与 Elysia 进行更多互动。提前编译静态资源的静态内容。默认属性、默认标题和一些改进。'
      },
      {
        title: '介绍 Elysia 0.7 - 星际恒星',
        href: '/blog/elysia-07',
        detail: '介绍了高达 13 倍更快的类型推断。使用追踪的声明性遥测。反应式 cookie 模型和 cookie 验证。TypeBox 0.31 和自定义解码器支持。重写的 Web Socket。定义重映和自定义词缀。为 Elysia 奠定更为坚实的基础，为更加光明的未来铺平道路。'
      },
      {
        title: '介绍 Elysia 0.6 - 游戏',
        href: '/blog/elysia-06',
        detail: '引入重新构想的插件模型，动态模式，通过声明性自定义错误提供更好的开发人员体验，可定制的松散和严格路径映射，TypeBox 0.30 和 WinterCG 框架互操作。再次推动可能性的边界。'
      },
      {
        title: '通过 Elysia 加速你的下一个 Prisma 服务器',
        href: '/blog/with-prisma',
        detail: '在 Prisma 与 Bun 以及 Elysia 的支持下，我们正在进入一个全新的开发者体验水平的新时代。对于 Prisma，我们可以加快与数据库的交互，Elysia 可以加速我们在开发者体验和性能方面创建后端 Web 服务器。'
      },
      {
          title: '介绍 Elysia 0.5 - 灿烂',
          href: '/blog/elysia-05',
          detail: '介绍静态代码分析、新路由器回忆录、TypeBox 0.28、数字类型、内联模式、状态/装饰/模型/组返工和类型稳定性。'
      },
      {
          title: '介绍 Elysia 0.4 - 月夜音乐会',
          href: '/blog/elysia-04',
          detail: '介绍提前编译，TypeBox 0.26，每个状态的响应验证，以及 Elysia Fn 的分离。'
      },
      {
          title: 'Elysia 与 Supabase - 在音速背后的下一个后端',
          href: '/blog/elysia-supabase',
          detail: 'Elysia 和 Supabase 非常适合在不到一个小时的时间内迅速开发原型，让我们来看看我们如何可以充分利用它们。'
      },
      {
          title: '介绍 Elysia 0.3 - 寻找地面边缘',
          href: '/blog/elysia-03',
          detail: '介绍 Elysia Fn，用于高度可扩展的 TypeScript 性能重新设计，文件上传支持和验证，重新设计的 Eden Treaty。'
      },
      {
          title: '使用 Elysia 将现有的 tRPC 服务器集成到 Bun 中',
          href: '/blog/integrate-trpc-with-elysia',
          detail: '了解如何使用 Elysia tRPC 插件将现有的 tRPC 集成到 Elysia 和 Bun 中，以及有关 Elysia 的 Eden 端到端类型安全的更多信息。'
      },
      {
          title: '介绍 Elysia 0.2 - 祝福',
          href: '/blog/elysia-02',
          detail: '介绍 Elysia 0.2，带来了更多的改进，主要是在 TypeScript 性能、类型推断和更好的自动完成以及一些减少模板的新功能。'
      }
  ]"
/>
