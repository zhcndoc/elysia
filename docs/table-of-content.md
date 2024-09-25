---
title: 内容纲要
head:
  - - meta
    - property: 'og:title'
      content: 内容纲要 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 学习 Elysia 没有正确或有条理的方法，但我们建议首先完成基本章节，因为该章节简要介绍了 Elysia 的大部分功能和基础，然后再跳转到你感兴趣的其他主题。完成基本章节后，你可以跳转到任何感兴趣的主题。不过，我们建议你遵循本章的顺序，因为本章可能会引用前一章的内容。

  - - meta
    - property: 'og:description'
      content: 学习 Elysia 没有正确或有条理的方法，但我们建议首先完成基本章节，因为该章节简要介绍了 Elysia 的大部分功能和基础，然后再跳转到你感兴趣的其他主题。完成基本章节后，你可以跳转到任何感兴趣的主题。不过，我们建议你遵循本章的顺序，因为本章可能会引用前一章的内容。
---

<script setup>
    import Card from '../components/nearl/card.vue'
    import Deck from '../components/nearl/card-deck.vue'
</script>

# 内容纲要

学习 Elysia 没有正确的方法，但我们建议**首先完成基本章节**，因为该章节简要介绍了 Elysia 的大部分功能和基础，然后再跳转到你感兴趣的其他主题。

<Deck>
	<Card title="速查表" href="/integrations/cheat-sheet">
	    Elysia 的快速参考
	</Card>
    <Card title="结构" href="/essential/structure">
        了解如何构建你的代码
    </Card>
    <Card title="校验" href="/essential/validation">
        强制数据类型并创建统一类型
    </Card>
    <Card title="生命周期" href="/essential/life-cycle">
        拦截事件和自定义行为
    </Card>
    <Card title="插件和作用域" href="/essential/plugin">
        理解如何分离 Elysia 以及作用域
    </Card>
    <Card title="Eden" href="/eden/overview">
        Elysia 的端到端类型安全客户端
    </Card>
</Deck>

---

完成基本章节后，你可以跳到你感兴趣的任何主题。我们按顺序组织了推荐章节，因为它可能会参考前一章。

### 前提知识

尽管 Elysia 文档的设计初衷是方便初学者，但我们需要建立一个基准，以便文档能够始终专注于 Elysia 的功能。每当介绍一个新概念时，我们都会提供相关文档的链接。

想要充分利用我们的文档，建议你对 Node.js 和基本 HTTP 有基本的了解。
