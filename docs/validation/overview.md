---
title: 校验
head:
    - - meta
      - property: 'title'
        content: 校验 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Elysia 提供了一个完整的模式构建器，为运行时和编译时间提供类型安全，这是使用 TypeBox 的数据的单一真实来源。

    - - meta
      - name: 'og:description'
        content: Elysia 提供了一个完整的模式构建器，为运行时和编译时间提供类型安全，这是使用 TypeBox 的数据的单一真实来源。
---

# 校验

创建应用程序接口服务器的意义在于接收输入并进行处理。

我们定义了数据的形状，允许客户端发送我们同意的输入，使一切行为正常。

但是，像 JavaScript 这样的动态语言默认情况下不会验证输入的形状。

未经检验的输入可能会导致意外行为、丢失数据部分，最糟糕的情况是，可能会导致恶意攻击服务器。

## 数据校验

将数据验证想象成由**专人**检查每个输入的适当形状，这样就不会破坏任何东西。

这样，我们就可以放心地创建东西，而不用担心问题。

这就是 Elysia 的作用所在。

Elysia 提供了一个完整的模式生成器，为运行时和编译时提供类型安全：

-   自动推导 TypeScript 类型
-   严格的数据校验
-   OpenAPI 模式可自动创建 Swagger 文档

Elysia 模式导出为 `Elysia.t` 或 **type** 的缩写。

Elysia type 基于 Sinclair 的 [TypeBox](https://github.com/sinclairzx81/typebox)，这是一个快速而广泛的验证库。

## 为什么 Elysia 要重新导出 TypeBox

Elysia 通过自定义类型扩展了 TypeBox 的使用，为 Elysia 内部代码生成提供了深度集成。

扩展和自定义 TypeBox 的默认行为，以匹配服务器端验证。

例如，Elysia Type 引入了一些新类型，如

-   **File**：HTTP Body 的文件或 Blob
-   **Numeric**：接受数字字符串并转换为数字
-   **ObjectString**：字符串化 JSON，转换为对象
-   **Email Format**：接受符合电子邮件模式的字符串

像这样的集成应该默认处理框架，而不是依赖用户端在每个项目上设置自定义类型，这就是为什么极简决定扩展并重新导出 TypeBox 库。

## 章节

本章将介绍 TypeBox 的基本用法，以及 Elysia 类型中引入的新 API (默认 TypeBox 未提供)。

我们建议先阅读基本章节的[模式](/essential/schema.html)，以了解 Elysia 类型的基本概念。

要了解更深入的主题，我们建议你查看 [TypeBox 文档](https://github.com/sinclairzx81/typebox)，因为专门的文档更侧重于每种类型的行为和它可以提供的附加设置。

如果你已经熟悉 TypeBox，请随时跳转到你感兴趣的主题。
