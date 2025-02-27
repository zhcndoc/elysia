---
title: 静态插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 静态插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，支持为 Elysia Server 提供静态文件/文件夹的服务。首先通过 "bun add @elysiajs/static" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，支持为 Elysia Server 提供静态文件/文件夹的服务。首先通过 "bun add @elysiajs/static" 安装插件。
---

# 静态插件
此插件可以为 Elysia Server 提供静态文件/文件夹的服务

安装方法：
```bash
bun add @elysiajs/static
```

然后使用它：
```typescript twoslash
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
    .use(staticPlugin())
    .listen(3000)
```

默认情况下，静态插件的默认文件夹是 `public`，并以 `/public` 前缀注册。

假设你的项目结构为：
```
| - src
  | - index.ts
| - public
  | - takodachi.png
  | - nested
    | - takodachi.png
```

可用的路径将变为：
- /public/takodachi.png
- /public/nested/takodachi.png

## 配置
以下是插件接受的配置

### assets
@default `"public"`

要暴露为静态的文件夹路径

### prefix
@default `"/public"`

注册公共文件的路径前缀

### ignorePatterns
@default `[]`

要忽略的不提供静态文件服务的文件列表

### staticLimit
@default `1024`

默认为，静态插件将以静态名称将路径注册到路由器，如果超过限制，路径将懒惰地添加到路由器以减少内存使用。
在内存和性能之间权衡。

### alwaysStatic
@default `false`

如果设置为 true，静态文件路径将跳过 `staticLimits` 注册到路由器。

### headers
@default `{}`

设置文件的响应头

### indexHTML
@default `false`

如果设置为 true，当请求既不匹配路由也不匹配任何现有静态文件时，将提供静态目录中的 `index.html` 文件。

## 模式
以下是使用该插件的常见模式。

- [单个文件](#单个文件)

## 单个文件
假设你只想返回一个单独的文件，可以使用 `file` 而不是使用静态插件
```typescript twoslash
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/file', file('public/takodachi.png'))
```