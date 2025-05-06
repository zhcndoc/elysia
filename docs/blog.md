---
title: Elysia 博客
layout: page
sidebar: false
editLink: false
search: false
gitChangelog: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 博客 - ElysiaJS

    - - meta
      - name: 'description'
        content: ElysiaJS 的更新，由核心维护者发布

    - - meta
      - property: 'og:description'
        content: ElysiaJS 的更新，由核心维护者发布
---

<script setup>
    import Blogs from './components/blog/Landing.vue'
</script>

<Blogs
  :blogs="[
      {
        title: 'Elysia 1.3 和科学女巫术',
        href: '/blog/elysia-13',
        cover: 'elysia-13.webp',
        detail: '接近零开销的标准化，使用精确镜像、Bun 系统路由器、独立验证器、类型实例化减少一半，以及显著的内存使用减少和更快的启动时间。'
      },
      {
        title: 'Elysia 1.2 - 你和我',
        href: '/blog/elysia-12',
        cover: 'elysia-12.webp',
        detail: '介绍适配器以支持通用运行时，带有解析的对象宏，带有自定义名称的解析器，带有生命周期的 WebSocket，支持递归类型的 TypeBox 0.34，以及 Eden 验证推断。'
      },
	  {
	    title: 'Elysia 1.1 - 大人的乐园',
	    href: '/blog/elysia-11',
        cover: 'elysia-11.webp',
	    detail: '引入 OpenTelemetry 和 Trace v2。数据强制和标准化。Guard 插件和批量转换。可选路径参数。装饰器和响应状态协调。生成器响应流。'
	  },
      {
        title: 'Elysia 1.0 - 堕落者的哀歌',
        href: '/blog/elysia-10',
        cover: 'lament-of-the-fallen.webp',
        detail: '引入 Sucrose，一个更好的静态代码分析引擎，启动时间提高至 14 倍，取消每实例 40 条路由的限制，类型推断速度最快可达 ~3.8 倍，Eden Treaty 2，Hook 类型（重大变化），严格类型检查的内联错误。'
      },
      {
        title: '引入 Elysia 0.8 - 斯坦因之门',
        href: '/blog/elysia-08',
        cover: 'gate-of-steiner.webp',
        detail: '引入 Macro API，一种与 Elysia 交互的新方式。新的生命周期，resolve 和 mapResponse，以便与 Elysia 进行更多交互。静态内容以提前编译静态资源。默认属性、默认头及多个改进。'
      },
      {
        title: '引入 Elysia 0.7 - 星辉璀璨',
        href: '/blog/elysia-07',
        cover: 'stellar-stellar.webp',
        detail: '引入高达 13 倍的更快类型推断。声明式遥测与追踪。反应式 Cookie 模型和 Cookie 验证。TypeBox 0.31 和自定义解码器支持。重写的 Web Socket。定义重映射和自定义后缀。为 Elysia 打下更坚实的基础，以迎接更加光明的未来。'
      },
      {
        title: '引入 Elysia 0.6 - 这场游戏',
        href: '/blog/elysia-06',
        cover: 'this-game.webp',
        detail: '引入重新构想的插件模型、动态模式、更好的开发者体验，支持声明式自定义错误、可自定义的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架互操作。再次推动可能性的边界。'
      },
      {
        title: '用 Elysia 加速你的下一个 Prisma 服务器',
        href: '/blog/with-prisma',
        cover: 'prism.webp',
        detail: '借助 Prisma、Bun 和 Elysia 的支持，我们进入了开发者体验的新纪元。对于 Prisma，我们可以加速与数据库的交互，而 Elysia 则加速了我们在开发者体验和性能方面创建后端 Web 服务器的过程。'
      },
      {
          title: '引入 Elysia 0.5 - 辉煌',
          href: '/blog/elysia-05',
          cover: 'radiant.webp',
          detail: '引入静态代码分析、新路由 Memoirist、TypeBox 0.28、数字类型、内联模式、状态/装饰/模型/组重构和类型稳定性。'
      },
      {
          title: '引入 Elysia 0.4 - 月夜之音乐会',
          href: '/blog/elysia-04',
          cover: 'moonlit-night-concert.webp',
          detail: '引入提前编译、TypeBox 0.26、按状态进行响应验证，以及 Elysia Fn 的分离。'
      },
      {
          title: '与 Supabase 的 Elysia。你的下一个后端以超音速推进',
          href: '/blog/elysia-supabase',
          cover: 'elysia-supabase.webp',
          detail: 'Elysia 和 Supabase 是快速开发原型的绝佳组合，少于一小时即可完成，让我们看看如何利用这两者的优势。'
      },
      {
          title: '引入 Elysia 0.3 - 寻找大地的边缘',
          href: '/blog/elysia-03',
          cover: 'edge-of-ground.webp',
          detail: '引入 Elysia Fn，为高可扩展性 TypeScript 性能进行类型重构，支持文件上传和验证，Eden Treaty 重构。'
      },
      {
          title: '引入 Elysia 0.2 - 祝福',
          href: '/blog/elysia-02',
          cover: 'blessing.webp',
          detail: '引入 Elysia 0.2，带来更多改进，主要集中在 TypeScript 性能、类型推断和更好的自动补全以及一些减少样板代码的新特性。'
      }
  ]"
/>
