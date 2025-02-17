---
title: Elysia 0.4 - 月夜的音乐会 (Moonlit Night Concert)
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.4 - 月夜的音乐会 (Moonlit Night Concert)

  - - meta
    - name: 'description'
      content: 介绍提前编译、TypeBox 0.26、按状态验证响应，以及分离 Elysia 函数。

  - - meta
    - property: 'og:description'
      content: 介绍提前编译、TypeBox 0.26、按状态验证响应，以及分离 Elysia 函数。

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.4 - 月夜的音乐会 (Moonlit Night Concert)"
    src="/blog/elysia-04/moonlit-night-concert.webp"
    alt="漂浮在深渊中的破碎玻璃片"
    author="saltyaom"
    date="2023 年 3 月 30 日"
>

该名称源自于 [《骗子公主演唱盲王子》预告片](https://youtu.be/UdBespMvxaA) 的开场音乐，由 Akiko Shikata 作曲和演唱的 [「月夜的音乐会」(Moonlit Night Concert)](https://youtu.be/o8b-IQulh1c)。

这个版本没有引入令人兴奋的新功能，而是为 Elysia 的未来打下了更坚实的基础，并进行了内部改进。

## 提前编译
默认情况下，Elysia 必须处理多种情况下的条件检查，例如，在执行之前检查路由的生命周期是否存在，或在提供的情况下解包验证模式。

这为 Elysia 引入了最小的开销，因为即使路由没有附加生命周期事件，仍需要在运行时进行检查。

由于每个函数都在编译时进行检查，因此不可能有条件的异步，例如，返回文件的简单路由应该是同步的，但由于这是编译时检查，有些路由可能是异步的，从而使相同的简单路由也变成异步的。

异步函数为函数引入额外的周期，导致性能稍慢。但由于 Elysia 是 Web 服务器的基础，我们希望优化每个部分，以确保您不会遇到性能问题。

我们通过引入提前编译来修复这种小开销。

顾名思义，Elysia 会在编译时检查生命周期、验证和异步函数的可能性，并生成一个紧凑的函数，去掉不必要的部分，如未使用的生命周期和验证。

使条件异步函数成为可能，因为我们不再使用一个中央函数来处理，而是为每个路由单独构建一个新函数。然后 Elysia 会检查所有生命周期函数和处理程序，以查看是否存在异步，如果没有，则函数将同步以减少额外开销。

## TypeBox 0.26
TypeBox 是一个库，为 Elysia 提供了验证和类型提供者，以创建类型级别的单一真相来源，重新导出为 **Elysia.t**。

在此更新中，我们将 TypeBox 从 0.25.4 更新到 0.26。

这带来了许多改进和新功能，例如，`Not` 类型和用于 `coercion` 值的 `Convert`，我们可能会在 Elysia 的下一个版本中支持。

但对 Elysia 的一个好处是，`Error.First()`，它允许我们获取第一个类型错误，而不是使用迭代器，这减少了创建新错误以发送回客户端的开销。

对 **TypeBox** 和 **Elysia.t** 进行了一些更改，通常不会对您产生太大影响，但您可以在 [这里查看 TypeBox 的新功能。](https://github.com/sinclairzx81/typebox/blob/master/changelog/0.26.0.md)

## 按状态验证响应
之前，Elysia 使用联合类型验证多个状态的响应。

这可能在高度动态的应用程序中产生意想不到的结果，特别是当状态响应严格时。
例如，如果您有一个路由如下：
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

如果 200 响应不是字符串，那么应该抛出验证错误，但实际上，不会抛出错误，因为响应验证使用的是联合。这可能会导致向最终用户返回意外的值，并对 Eden Treaty 产生类型错误。

此版本将响应按状态验证，而不是使用联合，这意味着它将严格根据响应状态进行验证，而不是联合类型。

## 分离 Elysia 函数
Elysia 函数是 Elysia 的一个很好的补充，与 Eden 一起，它打破了客户端与服务器之间的界限，使您能够在客户端使用任何服务器端函数，完全类型安全，甚至支持 primitive 类型，如 Error、Set 和 Map。

但是，随着 primitive 类型的支持，Elysia 函数依赖于 "superjson"，这大约占 Elysia 的依赖大小的 38%。

在此版本中，使用 Elysia 函数需要您明确安装 `@elysiajs/fn`。这种方法类似于安装其他功能，就像 `cargo add --feature` 一样。

这样，Elysia 对于不使用 Elysia 函数的服务器来说更加轻便，遵循我们的理念，**确保您拥有实际需要的功能**

然而，如果您忘记安装 Elysia 函数并意外使用了 Elysia 函数，将会出现类型警告，提醒您在使用之前安装 Elysia 函数，并且会有运行时错误提示相同的信息。

在迁移方面，除了需要明确安装 `@elysiajs/fn` 的重大更改外，没有其他迁移需求。

## 条件路由
此版本引入了用于注册条件路由或插件的 `.if` 方法。

这允许您针对特定条件进行声明，例如在生产环境中排除 Swagger 文档。
```ts
const isProduction = process.env.NODE_ENV === 'production'

const app = new Elysia().if(!isProduction, (app) =>
    app.use(swagger())
)
```

Eden Treaty 将能够识别该路由，就像它是一个普通路由/插件一样。

## 自定义验证错误
非常感谢 amirrezamahyari 在 [#31](https://github.com/elysiajs/elysia/pull/31) 上的贡献，使得 Elysia 能够访问 TypeBox 的错误属性，从而获得更好的程序错误响应。

```ts
new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return '未找到 :('
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

现在，您可以为您的 API 创建验证错误，而不仅限于第一个错误。

---

### 显著改进：
- 更新 TypeBox 到 0.26.8
- 内联声明响应类型
- 重构某些类型以加快响应速度
- 使用 Typebox `Error().First()` 代替迭代
- 添加 `innerHandle` 用于返回实际响应（进行基准测试）

### 重大更改：
- 将 `.fn` 分离到 `@elysiajs/fn`

## 之后
这个版本可能不是一个具有令人兴奋的新功能的大版本，但它改善了一个坚实的基础，并证明了我对未来 Elysia 计划的概念，使 Elysia 比以前更快、更灵活。

我对未来的展望感到非常兴奋。

感谢您对 Elysia 的持续支持~

> 月夜的音乐会，我们的秘密
>
> 让我们重新开始，不放开这只手

> 月夜的音乐会，我们的羁绊
>
> 我想告诉你，“你不是骗子”

> 我心中的记忆像一朵不断绽放的花
>
> 无论你是什么样子，你是我的歌者
>
> 今晚要在我身边

</Blog>
