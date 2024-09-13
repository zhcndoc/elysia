---
title: Elysia 0.2 - 祝福
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.2 - 祝福

  - - meta
    - name: 'description'
      content: 介绍 Elysia 0.2，主要在 TypeScript 性能、类型推断、更好的自动补全和一些新特性方面带来了更多改进，以减少样板代码。

  - - meta
    - property: 'og:description'
      content: 介绍 Elysia 0.2，主要在 TypeScript 性能、类型推断、更好的自动补全和一些新特性方面带来了更多改进，以减少样板代码。

  - - meta
    - property: 'og:image'
      content: https://elysia.zhcndoc.com/blog/elysia-02/blessing.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysia.zhcndoc.com/blog/elysia-02/blessing.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog 
    title="Elysia 0.2 - 祝福"
    src="/blog/elysia-02/blessing.webp"
    alt="夜空中的雪山上有一道从蓝色转变为紫色的极光。"
    author="saltyaom"
    date="2023 年 1 月 29 日"
>

“[祝福](https://youtu.be/3eytpBOkOFA)” 带来了更多改进，主要在 TypeScript 性能、类型推断和更好的自动补全方面，以及一些新特性以减少样板代码。

以 YOASOBI 的歌曲 “祝福” 命名，这是《机动战士高达：水星的魔女》的片头曲。

## 延迟加载模块 / 懒加载模块
Elysia 0.2 现在支持延迟加载模块和异步插件。

这使得有可能在 Elysia 服务器启动后推迟插件注册，以实现在无服务器/边缘环境中尽可能快的启动时间。

要创建延迟加载模块，只需将插件标记为异步：
```typescript
const plugin = async (app: Elysia) => {
    const stuff = await doSomeHeavyWork()

    return app.get('/heavy', stuff)
}

app.use(plugin)
```

### 懒加载
有些模块可能很重，在启动服务器之前导入可能不是好主意。

我们可以告诉 Elysia 跳过该模块，然后在加载完成后注册该模块，通过在 `use` 中使用 `import` 语句来注册模块：
```typescript
app.use(import('./some-heavy-module'))
```

这将使模块在导入完成后注册，实现懒加载。

延迟加载插件和懒加载模块将拥有所有类型推断，立即可用。


## 引用模型
Elysia 现在可以记住模式并直接在 Schema 字段中引用模式，无需通过 `Elysia.setModel` 创建导入文件。

这个模式可用列表，带来了自动补全，完整的类型推断，以及你所期望的验证。

要使用引用模型，首先通过 `setModel` 注册模型，然后在 `schema` 中写一个模型名称来引用模型：
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

这会带来已知模型的自动补全。
<img width="1624" alt="Screenshot 2566-01-23 at 13 24 28" src="https://user-images.githubusercontent.com/35027979/213980696-8f20a934-c500-4f97-884c-ff2dd2efadfe.png">

以及类型引用阻止你无意中返回无效类型。
<img width="1624" alt="Screenshot 2566-01-23 at 13 26 00" src="https://user-images.githubusercontent.com/35027979/213980738-0e99cb25-a50f-4888-8879-f00d4ad04363.png">

使用 `@elysiajs/swagger` 也会为可用模型创建一个单独的 `Model` 部分。
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213980936-5857e30b-fd4b-4fc3-8aff-fdb9054980d3.png">

引用也处理了你所期望的验证。

简而言之，这和内联 Schema 一样，现在你只需输入模式名称来处理验证和类型，而不是一个长长的导入列表。

## OpenAPI 详细字段
引入了新的字段 `schema.detail`，用于根据 OpenAPI Schema V2 标准自定义路由的详细信息，并带有自动补全。

<!-- <img width="1624" alt="Screenshot 2566-01-23 at 13 54 11" src="https://user-images.githubusercontent.com/35027979/213981321-5717e514-34bc-4db2-86ed-530d27d7ba97.png"> -->

这允许你编写更好的文档，并完全可编辑的 Swagger 文档：
<!-- <img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213981545-46efc6cc-34bc-4db2-8aff-530d27d7ba97.png"> -->

## 联合类型
Elysia 之前的版本有时会在区分联合类型时遇到问题，因为 Elysia 试图捕获响应以创建一个完整的类型引用给 Eden。

结果是对可能的类型进行了无效化，

## 联合响应
通过联合类型实现可能，现在在 `schema` 中返回多个响应状态码现在可用，使用 `schema.response[statusCode]`：

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

Elysia 将尝试验证 `response` 中的所有模式，允许返回其中的一个类型。

返回类型也在 Swagger 的响应中得到支持。

## 更快的类型推断
随着 Elysia 0.1 探索使用类型推断来改进更好的开发者体验的可能性，我们发现有时更新类型推断需要很长时间，因为重载类型推断和低效的自定义泛型。

通过 Elysia 0.2 现在优化为更快的类型推断，防止了重载类型展开的冗余，结果在更新类型和推断方面性能更好。

## 生态系统
随着 Elysia 0.2 启用异步插件和延迟模块，许多之前不可能实现的新的插件成为了现实。

比如：
- Elysia 静态插件具有非阻塞能力
- Eden 支持联合类型的推断，用于多种响应
- 新 Elysia Apollo 插件

### 值得注意的改进：
- `onRequest` 和 `onParse` 现在可以访问 `PreContext`
- 默认支持 `application/x-www-form-urlencoded`
- 体解析器现在解析 `content-type`，附带额外属性，例如 `application/json;charset=utf-8`
- 解码 URI 参数路径参数
- Eden 现在如果在未安装 Elysia 时会报告错误
- 跳过声明已存在的模型和装饰器

### 破坏性变更：
- `onParse` 现在接受 `(context: PreContext, contentType: string)` 而不是 `(request: Request, contentType: string)`
    - 要迁移，在上下文中添加 `.request` 来访问 `Request`

### 后记
感谢你支持 Elysia 并对此项目感兴趣。

这次发布带来了更好的 DX，并希望所有你需要的来用 Bun 编写出色的软件。

现在我们有了 [Discord 服务器](https://discord.gg/eaFJ2KDJck)，你可以在其中提出任何关于 Elysia 的问题，或者只是闲逛和放松周围的地方也非常欢迎。

有了这些出色的工具，我们很高兴看到你将构建哪些出色的软件。

> 不成为那些由别人描绘的图画的一部分
>
> 不前进那被别人选择的节目
>
> 你和我，活着去书写我们的故事
>
> 将永远不会让你孤独，从你的身边消失
>
</Blog>