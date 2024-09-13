---
title: Elysia 0.4 - 月夜音乐会
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.4 - 月夜音乐会

  - - meta
    - name: 'description'
      content: 介绍 Ahead of Time Compilation, TypeBox 0.26, 按状态响应验证, 和 Elysia Fn 的分离。

  - - meta
    - property: 'og:description'
      content: 介绍 Ahead of Time Compilation, TypeBox 0.26, 按状态响应验证, 和 Elysia Fn 的分离

  - - meta
    - property: 'og:image'
      content: https://elysia.zhcndoc.com/blog/elysia-04/moonlit-night-concert.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysia.zhcndoc.com/blog/elysia-04/moonlit-night-concert.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.4 - 月夜音乐会"
    src="/blog/elysia-04/moonlit-night-concert.webp"
    alt="破碎的玻璃碎片漂浮在深渊中"
    author="saltyaom"
    date="2023 年 3 月 30 日"
>

以 [“The Liar Princess and the Blind Prince”](https://youtu.be/UdBespMvxaA) 预告片的开场音乐命名，由 Akiko Shikata 创作和演唱的 [“月夜 の 音楽会” (Moonlit Night Concert)](https://youtu.be/o8b-IQulh1c)。

这个版本并没有引入一个激动人心的新特性，而是为 Elysia 的未来奠定了更加坚实的基础，以及对内部进行了改进。

## 预编译
默认情况下，Elysia 需要在各种情况下处理条件检查，例如在执行之前检查路由的生命周期是否存在，或者如果提供了就解包验证模式。

这为 Elysia 引入了一定程度的额外开销，并且整体上，即使路由没有附加生命周期事件，也需要在运行时进行检查。

由于每个函数都是在编译时进行检查的，所以不可能有条件地使用异步函数，例如，一个简单的返回文件的路径应该同步执行，但是由于是编译时检查，一些路径可能是异步的，从而使得相同的简单路径也变成异步。

异步函数引入了额外的 tick，使得函数执行稍微慢一些。但由于 Elysia 是一个构建 Web 服务器的基础，我们希望优化每个部分以确保你不会遇到性能问题。

我们通过引入 Ahead Time Compilation 解决了这一小部分开销。

正如名称所暗示的，Elysia 不再在运行时检查动态的生命周期和验证，而是检查生命周期、验证以及异步函数的可能性，并生成一个紧凑的函数，移除不必要的部分，如未使用的生命周期和验证。

这使得条件异步函数成为可能，因为我们不再使用一个中心化的函数来处理，而是为每个路由特别组合一个新的函数。然后 Elysia 检查所有生命周期函数和处理程序，以查看是否有异步，如果没有，函数将同步执行以减少额外开销。

## TypeBox 0.26
TypeBox 是一个为 Elysia 的验证和类型提供者提供动力的库，作为 **Elysia.t** 导出。

在这个更新中，我们将 TypeBox 从 0.25.4 更新到 0.26。

这带来了很多改进和新特性，例如 `Not` 类型和 `Convert` 用于 `coercion` 值，我们可能会在 Elysia 的下一个版本中支持这些。

但对于 Elysia 来说，一个好处是 `Error.First()`，它允许我们获取类型的第一个错误，而不是使用 Iterator，这减少了在创建新错误以发送回客户端时的开销。

有一些 **TypeBox** 和 **Elysia.t** 的变化可能不会对你产生太大影响，但你可以查看 [TypeBox 发布在这里](https://github.com/sinclairzx81/typebox/blob/master/changelog/0.26.0.md)的新特性。

## 根据状态验证响应
之前，Elysia 的响应验证使用了联合类型来验证多个状态响应。

对于高度动态的应用程序和严格的状态响应来说，这可能会产生意外结果。
例如，如果你有一个这样的路由：
```ts
app.post('/strict-status', process, {
    schema: {
        response: {
            200: t.String(),
            400: t.Number()
        }
    }
})
```

期望的是，如果 200 响应不是字符串，那么它应该抛出一个验证错误，但在现实中它不会抛出错误，因为响应验证使用了联合类型。这可能会给最终用户留下意外的值，并对 Eden Treaty 产生类型错误。

随着这个发布，响应是根据状态逐一验证的，这意味着它将严格根据响应状态而不是联合类型进行验证。

## Elysia Fn 的分离
Elysia Fn 是 Elysia 的一个很好的补充，配合 Eden，打破了客户端与服务器之间的界限，允许你在客户端使用任何服务器端函数，完全类型安全，甚至可以使用原始类型，如 Error、Set 和 Map。

但是，由于原始类型支持，Elysia Fn 依赖于 “superjson”，这大约占 Elysia 依赖大小的 38%。

在这个版本中，要使用 Elysia Fn，你需要明确安装 `@elysiajs/fn` 来使用 Elysia Fn。这种方法类似于安装一个额外的特性，就像 `cargo add --feature` 一样。

这使得不使用 Elysia Fn 的服务器变得更轻量，遵循我们的理念，即**确保你拥有真正需要的东西**。

但是，如果你忘记安装 Elysia Fn 并意外使用 Elysia Fn，将会有一个类型警告提醒你在使用前安装 Elysia Fn，以及一个运行时错误指出同样的问题。

对于迁移，除了明确安装 `@elysiajs/fn` 的破环更改之外，没有迁移需求。

## 条件路由
这个版本引入了 `.if` 方法来注册一个有条件的路线或插件。

这允许你声明性地为特定条件注册，例如在生产环境中排除 Swagger 文档。
```ts
const isProduction = process.env.NODE_ENV === 'production'

const app = new Elysia().if(!isProduction, (app) =>
    app.use(swagger())
)
```

Eden Treaty 能够识别路由就像普通路由/插件一样。

## 自定义验证错误
感谢 amirrezamahyari 在 [#31](https://github.com/elysiajs/elysia/pull/31) 中的贡献，这允许 Elysia 访问 TypeBox 的错误属性，以便更好地以编程方式响应错误。

```ts
new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }

        if (code === 'VALIDATION') {
            set.status = 400

            return {
                fields: error.all()
            }
        }
    })
    .post('/sign-in', () => 'hi', {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
    .listen(3000)
```

现在你可以为 API 创建验证错误，而不仅仅是第一个错误。

---

### 值得注意的改进：
- 更新 TypeBox 到 0.26.8
- 对响应类型进行内联声明
- 重构一些类型以加快响应
- 使用 Typebox `Error().First()` 而不是迭代
- 添加 `innerHandle` 以返回实际响应 (用于基准测试)

### 破坏性更改：
- 将 `.fn` 分离到 `@elysiajs/fn`

## 后续
这个版本可能不是一个大版本，没有引入一个激动人心的新特性，但它改进了一个坚实的基础，并且为 Elysia 的未来计划提供了一个概念验证，使 Elysia 比以往任何时候都更快、更灵活。

我真的很期待未来会揭晓的内容。

感谢你对 Elysia 持续的支持~

> 月夜 の 音楽会，我们的秘密
>
> 不放开这手，让我们再次开始

> 月夜 の 音楽会，我们的牵绊
>
> 我想告诉你，“你不是一个骗子”

> 心中的记忆如同不断绽放的花朵
>
> 不管你是什么模样，你都是我的歌者
>
> 今晚请留在我身边

</Blog>