---
title: Elysia 1.4 - 超对称
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: 比 Encore 快 2 倍 —— 1 年后的表现

    - - meta
      - name: 'description'
        content: 经过 1.5 年的发展，Elysia 现在比 Encore 快 2 倍。更新自最初的基准测试，深入解析我们如何实现这一性能提升。

    - - meta
      - property: 'og:description'
        content: 经过 1.5 年的发展，Elysia 现在比 Encore 快 2 倍。更新自最初的基准测试，深入解析我们如何实现这一性能提升。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-v-encore/elysia-v-encore.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-v-encore/elysia-v-encore.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="比 Encore 快 2 倍 —— 1 年后的表现"
    src="/blog/elysia-v-encore/elysia-v-encore.webp"
    alt="比 Encore 快 2 倍。Encore vs Elysia 性能对比 1.5 年后"
    author="saltyaom"
    date="2025 年 11 月 14 日"
    shadow
>

2024 年 6 月 17 日，Encore 发布了一篇博客文章，[比 Express.js 快 9 倍，比 ElysiaJS & Hono 快 3 倍](https://encore.dev/blog/event-loops)，宣称 Encore 比 Elysia 和 Hono 快 3 倍。

而今天，经过 1.5 年的发展，在同一个基准测试中，Elysia 现在比 Encore 快 2 倍。

## 简介

EncoreTS 是一个由*多线程 Rust 运行时*驱动，并绑定到 Node.js 的框架。它利用 Rust 的性能和安全特性，构建高性能的 Web 应用。

Encore 声称通过使用 Rust 处理性能关键任务，同时为开发者提供熟悉的 JavaScript/TypeScript 接口，实现了比 Elysia 和 Hono 更快的性能。

![EncoreTS 首页上的基准测试](/blog/elysia-v-encore/encore-benchmark.webp)
> EncoreTS 首页上的基准测试

1.5 年过去了，我们重新审视了基准测试，来看 Elysia 对比 Encore 的表现。

## 重新审视基准测试

该基准测试公开于 [Encore 的 GitHub](https://github.com/encoredev/ts-benchmarks)，我们[分叉了该仓库](https://github.com/saltyaom/encore-ts-benchmarks)，使用最新版本的 Elysia 运行了测试。

经过检查，我们注意到最初 Elysia 的基准测试并未针对生产环境进行优化。为了确保公平对比，我们做了以下调整：

以下是我们做出的一些更改：
1. 在 Elysia 脚本中加入 `bun compile` 来优化生产打包
2. 更新 Elysia 的裸请求测试，改用静态资源
3. 由于机器规格，调整 oha 的并发数从 `150` 提升到 `450` 以扩大承载上限

最后，我们将所有必要依赖均升级至最新版本：
- Encore: 1.5.17
- Rust: 1.91.1
- Elysia: 1.4.16
- Bun: 1.3.2

以下是我们用于测试的机器规格：
- 测试日期：2025 年 11 月 14 日
- 机器规格：Intel i7-13700K，DDR5 32GB 5600MHz
- 操作系统：Debian 11 (bullseye) 运行于 WSL，内核版本 5.15.167.4-microsoft-standard-WSL2

## 基准测试结果
完成测试后，得到如下结果：

![基准测试结果](/blog/elysia-v-encore/benchmark-result.webp)
> 基准测试结果：Elysia 是 Encore 的 2 倍速

| 框架 | 无验证 | 有验证 |
| --- | --- | --- |
| Encore | 139,033 | 95,854 |
| Elysia | 293,991 | 223,924 |

使用原始基准测试，Elysia 在所有类别中均超越 Encore，所有测试的每秒请求数均达到两倍。

这是一个[视频演示教程](https://x.com/saltyAom/status/1989218344969580838)，展示如何跑基准测试。

## 我们是如何做到的？
在最初的基准测试中，Elysia 版本为 1.1.16。此后，我们通过各种优化和增强显著提升了 Elysia 的性能。

总体来说，在过去的一年里，Elysia 和 Bun 都取得了重大性能提升。

### 精准镜像 (Exact Mirror)
在最初 Encore 的基准测试里，Elysia 每次请求都会执行数据规范化，这为请求处理加入了不少开销。

瓶颈不在于数据验证本身，而是由于规范化过程中涉及动态数据变异。

在 [Elysia 1.3](/blog/elysia-13.html#exact-mirror) 中，我们引入了 [Exact Mirror](https://github.com/elysiajs/exact-mirror) ，通过 JIT 编译代替动态数据变异来加速数据规范化。

这极大提升了数据规范化的性能，对于中等大小的负载，性能提升可达 **约 30 倍**。

![Exact Mirror 在中等大小负载下分别达到 29.46x 和 31.6x 的性能提升](/blog/elysia-13/exact-mirror-large.webp)
> Exact Mirror 实现中等负载下约 30 倍加速

这显著提高了 Elysia 的验证性能。

### 通用 JIT 优化
在 Elysia 1.1（上游版本）到当前的 1.4 之间，我们对 Elysia 进行了多项 JIT 优化，尤其针对 Sucrose，这是 Elysia 的 *JIT 编译器*。

这些优化包括：
- 常量折叠，内联生命周期事件
- 降低验证和类型转换开销
- 最小化中间件和插件的开销
- 提升内部数据结构的效率
- 减少请求处理中的内存分配
- 及其他多种微观优化

在 Bun 1.2.3 中，Bun 引入了原生代码中的内建路由以提升性能。

在 Elysia 1.3 中，我们尽可能采用 Bun 的原生路由以提升路由性能。

### Bun 编译
在原始基准测试中，Elysia 没有进行生产环境编译。

使用 `bun compile` 对 Elysia 应用进行生产编译，带来显著性能提升，并减少内存使用。

## 结论

通过持续改进，在过去 1.5 年里，Elysia 显著优化了性能，使该框架在同一基准测试中达到比 Encore 快 2 倍的水平。

选择框架时，基准测试并非唯一因素。开发体验、生态系统及社区支持同样重要。

尽管基准测试难以完美覆盖所有场景，我们详细说明了基准测试步骤，推荐你在自己的机器上运行[基准测试](https://github.com/saltyaom/encore-ts-benchmarks)，以获得最适合自己使用场景的准确结果。

</Blog>