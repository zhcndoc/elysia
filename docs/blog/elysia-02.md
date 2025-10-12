---
title: Elysia 0.2 - 祝福
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.2 - 祝福

  - - meta
    - name: 'description'
      content: 介绍 Elysia 0.2，带来更多改进，主要集中在 TypeScript 性能、类型推断、更好的自动补全以及一些新功能，以减少样板代码。

  - - meta
    - property: 'og:description'
      content: 介绍 Elysia 0.2，带来更多改进，主要集中在 TypeScript 性能、类型推断、更好的自动补全以及一些新功能，以减少样板代码。

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.2 - 祝福"
    src="/blog/elysia-02/blessing.webp"
    alt="夜空中雪山上方的蓝紫色极光"
    author="saltyaom"
    date="2023 年 1 月 29 日"
>


「[祝福](https://youtu.be/3eytpBOkOFA)」带来了许多改进，主要集中在 TypeScript 性能、类型推断、更好的自动补全以及一些新功能，以减少样板代码。

以 YOASOBI 的歌曲「祝福」命名，这是《机动战士高达：水星的魔女》的主题曲。

## 延迟加载 / 懒加载模块
Elysia 0.2 现在增加了对懒加载模块和异步插件的支持。

这使得在 Elysia 服务器启动后延迟插件注册并逐步应用插件成为可能，从而实现了在无服务器/边缘环境中尽可能快的启动时间。

要创建一个延迟模块，只需将插件标记为异步：
```typescript
const plugin = async (app: Elysia) => {
    const stuff = await doSomeHeavyWork()

    return app.get('/heavy', stuff)
}

app.use(plugin)
```

### 懒加载
某些模块可能很大，在启动服务器之前导入可能不是一个好主意。

我们可以告诉 Elysia 跳过该模块，然后稍后注册模块，并在加载完成时使用 `import` 语句在 `use` 中注册模块：
```typescript
app.use(import('./some-heavy-module'))
```

这将在导入完成后注册模块，使模块实现懒加载。

延迟插件和懒加载模块将直接支持完整的类型推断。

## 引用模型
现在 Elysia 可以记住架构并直接在 Schema 字段中引用它们，而无需通过 `Elysia.setModel` 创建导入文件。

此可用架构列表提供了自动补全、完整的类型推断和您所期望的内联架构验证。

要使用引用模型，首先使用 `setModel` 注册模型，然后在 `schema` 中写入模型名称以引用模型：
```typescript
const app = new Elysia()
    .setModel({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
```

这将提供已知模型的自动补全。
<img width="1624" alt="Screenshot 2566-01-23 at 13 24 28" src="https://user-images.githubusercontent.com/35027979/213980696-8f20a934-c500-4f97-884c-ff2dd2efadfe.png">

并且类型引用可以防止您意外返回无效类型。
<img width="1624" alt="Screenshot 2566-01-23 at 13 26 00" src="https://user-images.githubusercontent.com/35027979/213980738-0e99cb25-a50f-4888-8879-f00d4ad04363.png">

使用 `@elysiajs/swagger` 还将创建一个单独的 `Model` 部分来列出可用模型。
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213980936-5857e30b-fd4b-4fc3-8aff-fdb9054980d3.png">

引用也能处理验证，就像您所期望的那样。

简而言之，这与使用内联架构相同，但现在您只需输入架构的名称即可处理验证和类型，而不再需要一长串导入。

## OpenAPI 详细字段
引入一个新字段 `schema.detail`，用于定制路由的详细信息，遵循 OpenAPI Schema V2 的标准并支持自动补全。

<img width="1624" alt="Screenshot 2566-01-23 at 13 54 11" src="https://user-images.githubusercontent.com/35027979/213981321-5717e514-aa4b-492a-b45a-9e69099dc8a8.png">

这使您能够编写更好的文档，并拥有一个完全可编辑的 Swagger，如您所愿：
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213981545-46efc6cc-34bc-4db2-86ed-530d27d7ba97.png">

## 联合类型
Elysia 的先前版本有时在区分联合类型时存在问题，因为 Elysia 尝试捕获响应以为 Eden 创建完整的类型引用。

这导致可能的类型失效。

## 联合响应
通过联合类型，现在可以使用 `schema.response[statusCode]` 返回多个响应状态。

```typescript
app
    .post(
        '/json/:id',
        ({ body, params: { id } }) => ({
            ...body,
            id
        }),
        {
            schema: {
                body: 'sign',
                response: {
                    200: t.Object({
                        username: t.String(),
                        password: t.String(),
                        id: t.String()
                    }),
                    400: t.Object({
                        error: t.String()
                    })
                }
            }
        }
    )
```

Elysia 将尝试验证 `response` 中的所有架构，允许返回其中一种类型。

返回类型也被支持并在 Swagger 的响应中报告。

## 更快的类型推断
随着 Elysia 0.1 探索使用类型推断来改善开发者体验，我们发现由于重型类型推断和低效的自定义泛型，有时更新类型推断需要很长时间。

通过 Elysia 0.2，类型推断现在经过速度优化，防止重复的重型类型展开，从而提高了更新类型和推断的性能。

## 生态系统
Elysia 0.2 启用异步插件和延迟模块，许多之前无法实现的新插件已成为现实。

例如：
- 具有非阻塞能力的 Elysia 静态插件
- Eden 具有多响应的联合类型推断
- 新的 Elysia Apollo 插件

### 显著改进：
- `onRequest` 和 `onParse` 现在可以访问 `PreContext`
- 默认支持 `application/x-www-form-urlencoded`
- 正文解析器现在解析带有额外属性的 `content-type`，例如 `application/json;charset=utf-8`
- 解码 URI 路径参数
- 如果 Elysia 未安装，Eden 现在报告错误
- 跳过已存在模型和装饰器的声明

### 破坏性更改：
- `onParse` 现在接受 `(context: PreContext, contentType: string)` 而不是 `(request: Request, contentType: string)`
    - 迁移时，请将 `.request` 添加到上下文以访问 `Request`

### 之后
感谢您支持 Elysia 并对该项目感兴趣。

这个版本带来了更好的开发体验，并希望提供您用 Bun 编写出色软件所需的一切。

我们现在有一个 [Discord 服务器](https://discord.gg/eaFJ2KDJck)，您可以在这里询问有关 Elysia 的任何问题或只是来放松一下——欢迎大家加入。

有了这些出色的工具，我们期待看到您构建出惊人的软件。

> 不要成为别人描绘的那些图像的一部分
>
> 不要在别人选择的展示中前进
>
> 你和我，活着去书写我们的故事
>
> 永远不会让你孤单，远离你的身边
>
</Blog>