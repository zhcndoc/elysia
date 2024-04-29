---
title: Static Plugin
head:
    - - meta
      - property: 'og:title'
        content: Static Plugin - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 插件用于为 Elysia Server 添加对静态文件/文件夹的支持。首先使用 "bun add @elysiajs/static" 安装插件。

    - - meta
      - name: 'og:description'
        content: 插件用于为 Elysia Server 添加对静态文件/文件夹的支持。首先使用 "bun add @elysiajs/static" 安装插件。
---

# Static Plugin
该插件可为 Elysia Server 提供静态文件/文件夹的服务

安装方法：
```bash
bun add @elysiajs/static
```

然后使用该插件：
```typescript
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

new Elysia()
    .use(staticPlugin())
    .listen(3000);
```

默认情况下，静态插件的默认文件夹为 `public`，并通过 `/public` 前缀进行注册。

假设您的项目结构如下：
```
| - src
  | - index.ts
| - public
  | - takodachi.png
  | - nested
    | - takodachi.png
```

可用的路径如下：
- /public/takodachi.png
- /public/nested/takodachi.png

## 配置
以下是插件接受的配置

### assets
@default `"public"`

要公开为静态文件的文件夹路径

### prefix
@default `"/public"`

注册公共文件的路径前缀

### ignorePatterns
@default `[]`

要忽略作为静态文件提供的文件列表

### staticLimits
@default `1024`

默认情况下，如果超出限制，静态插件将使用静态名称和路径进行注册，如果超出限制，路径将懒加载添加到路由器以减少内存使用。平衡内存与性能。

### alwaysStatic
@default `false`

如果设为 true，则静态文件将直接注册到路由器，跳过 `staticLimits`。

### headers
@default `{}`

设置文件的响应头

## 模式
以下是使用该插件的常见模式。

- [单文件](#单文件)

## 单文件
假设您只想返回单个文件，可以使用 `Bun.file` 而不是使用静态插件
```typescript
new Elysia()
    .get('/file', () => Bun.file('public/takodachi.png'))
```