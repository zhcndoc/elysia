---
title: 与 Nuxt 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Nuxt 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: 通过社区插件 'nuxt-elysia'，我们可以自动使用 Eden Treaty 配置在 Nuxt API 路由上运行 Elysia。

    - - meta
      - property: 'og:description'
        content: 通过社区插件 'nuxt-elysia'，我们可以自动使用 Eden Treaty 配置在 Nuxt API 路由上运行 Elysia。
---

# 与 Nuxt 集成

我们可以使用 Nuxt 的社区插件 [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia)，在 Nuxt API 路由上通过 Eden Treaty 设置 Elysia。

1. 通过以下命令安装插件：

```bash
bun add elysia @elysia/eden
bun add -d nuxt-elysia
```

2. 在你的 Nuxt 配置中添加 `nuxt-elysia`：

```ts
export default defineNuxtConfig({
    modules: [ // [!code ++]
        'nuxt-elysia' // [!code ++]
    ], // [!code ++]
    nitro: { // [!code ++]
        preset: 'Bun' // [!code ++]
    } // [!code ++]
})
```

::: tip
`nitro.preset: 'Bun'` 配置是必需的，因为 Elysia 运行在 Bun 运行时。这告诉 Nuxt 的 Nitro 使用 Bun 作为服务器运行时，而非默认的 Node.js 运行时。
:::

3. 在项目根目录创建 `api.ts`：

```typescript [api.ts]
export default () => new Elysia() // [!code ++]
  .get('/hello', () => ({ message: 'Hello world!' })) // [!code ++]
```

4. 在你的 Nuxt 应用中使用 Eden Treaty：

```vue
<template>
    <div>
        <p>{{ data.message }}</p>
    </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp()

const { data } = await useAsyncData(async () => {
    const { data, error } = await $api.hello.get()

    if (error)
        throw new Error('调用 API 失败')

    return data
})
</script>
```

这将自动将 Elysia 设置为在 Nuxt API 路由上运行。

### pnpm
如果你使用 pnpm，[pnpm 默认不自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，你需要手动安装额外依赖。
```bash
pnpm add @sinclair/typebox openapi-types
```

## 前缀

默认情况下，Elysia 会挂载在 **/_api**，但我们可以通过 `nuxt-elysia` 配置来自定义挂载路径。
```ts
export default defineNuxtConfig({
	nuxtElysia: {
		path: '/api' // [!code ++]
	}
})
```

这会将 Elysia 挂载到 **/api**，而非 **/_api**。

更多配置选项，请参考 [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia) 。
