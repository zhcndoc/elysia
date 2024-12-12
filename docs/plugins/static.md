---
title: 静态插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 静态插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，支持为 Elysia 服务器提供静态文件/文件夹的服务。首先通过 "bun add @elysiajs/static" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，支持为 Elysia 服务器提供静态文件/文件夹的服务。首先通过 "bun add @elysiajs/static" 安装插件。
---

# 静态插件
该插件可以为 Elysia 服务器提供静态文件/文件夹服务。

通过以下方式安装：
```bash
bun add @elysiajs/static
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
    .use(staticPlugin())
    .listen(3000)
```

默认情况下，静态插件的默认文件夹为 `public`，并注册为 `/public` 前缀。

假设您的项目结构如下：
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
以下是插件接受的配置项：

### assets
@默认值 `"public"`

要暴露为静态的文件夹路径。

### prefix
@默认值 `"/public"`

注册公共文件的路径前缀。

### ignorePatterns
@默认值 `[]`

要忽略的静态文件列表。

### staticLimit
@默认值 `1024`

默认情况下，静态插件将以静态名称将路径注册到路由器，如果超过限制，路径将懒加载到路由器以减少内存使用。
在性能和内存之间权衡。

### alwaysStatic
@默认值 `false`

如果设置为 true，将跳过 `staticLimits` 将静态文件路径注册到路由器。

### headers
@默认值 `{}`

设置文件的响应头。

### indexHTML
@默认值 `false`

如果设置为 true，则静态目录中的 `index.html` 文件将用于处理任何既不匹配路由也不匹配任何现有静态文件的请求。

## 常见模式
以下是使用插件的常见模式。

- [单文件](#单文件)

## 单文件
假设您只想返回一个单独的文件，您可以使用 `Bun.file` 来替代静态插件：
```typescript
new Elysia()
    .get('/file', () => Bun.file('public/takodachi.png'))
```
