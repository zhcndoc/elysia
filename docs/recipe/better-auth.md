---
title: 更好的身份验证 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 更好的身份验证 - ElysiaJS

  - - meta
    - name: 'description'
      content: 我们可以使用 @better-auth/cli 生成身份验证架构并迁移我们的数据库。

  - - meta
    - name: 'og:description'
      content: 我们可以使用 @better-auth/cli 生成身份验证架构并迁移我们的数据库。
---

# 更好的身份验证
更好的身份验证是一个与框架无关的 TypeScript 身份验证（和授权）框架。它提供了开箱即用的全面功能，并包括一个插件生态系统，以简化添加高级功能。

更好的身份验证具有一个 cli 工具，可以生成身份验证架构并迁移我们的数据库。它目前有 3 个数据库适配器：

- [Prisma](https://www.prisma.io/)
- [Drizzle](https://orm.drizzle.team/)
- [Mongoose](https://mongoosejs.com/)

## 更好的身份验证 CLI
更好的身份验证有一个 cli 工具来生成我们数据库中的身份验证架构，包含以下核心表：`user`、`session`、`account` 和 `verification`。关于核心架构的更多信息，请参阅 [更好的身份验证核心架构](https://www.better-auth.com/docs/concepts/database#core-schema)。

要了解如何配置您的数据库，请参考 [更好的身份验证数据库](https://www.better-auth.com/docs/concepts/database)。

要了解如何使用 cli，请参考 [更好的身份验证 CLI](https://www.better-auth.com/docs/concepts/cli)。

## 安装
要安装更好的身份验证，请运行以下命令：

```bash
bun add better-auth
```

确保设置您的环境变量以支持更好的身份验证秘密 `BETTER_AUTH_SECRET=` 和其他环境变量，例如 Github 和 Google 客户端 ID 和密钥。

在项目的 `src` 文件夹中，创建一个 `libs/auth` 或 `utils/auth` 文件夹，并在其中创建一个 `auth.ts` 文件，复制以下代码：

## 更好的身份验证实例

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../database";
import { account, session, user, verification } from "../../database/schema";
export const auth = betterAuth({
  database: drizzleAdapter(db, { // 我们使用 Drizzle 作为我们的数据库
    provider: "pg",
    /*
    * 将您的架构映射到更好的身份验证架构
    */
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  socialProviders: {
    /*
    * 我们使用 Google 和 Github 作为我们的社交提供者， 
    * 确保您已设置环境变量
    */
    emailAndPassword: {  
        enabled: true // 如果您想使用电子邮件和密码认证
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

```

现在只需运行以生成所需表的身份验证架构。
``` bash
bunx @better-auth/cli generate --config ./src/libs/auth/auth.ts
``` 
此外，您可以使用 `--output` 选项指定生成文件的输出目录。然后，我们可以使用 drizzle 迁移命令来迁移我们的数据库 `drizzle-kit migrate`。

## 更好的身份验证视图

我们需要设置一个视图来处理更好的身份验证上下文。创建一个文件在 `src/utils/auth-view.ts` 或 `src/libs/auth/auth-view.ts` 中，并复制以下代码：

```ts
import { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
      console.log(context.request)
      return auth.handler(context.request);
    }
    else {
      context.error(405)
    }
  }

export default betterAuthView;
```

## 更好的身份验证中间件

我们可以设置一个简单的中间件来处理更好的身份验证。在 `src/middlewares/auth-middleware.ts` 中创建一个文件，并复制以下代码：

```ts
import { Session, User } from "better-auth/types";
import { auth } from "../../utils/auth/auth";
import { Context } from "elysia";
 
export const userMiddleware = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.request.headers });
 
  if (!session) {
    c.set.status = 401;
    return { success: 'error', message: "未授权访问：令牌丢失" };
  }
 
  return {
    user: session.user,
    session: session.session
  }
}

export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session
  }
}
```

## 将更好的身份验证附加到我们的 Elysia 应用

在我们的 index.ts 文件中，我们可以附加身份验证视图，以便监听我们的身份验证路由，并添加以下代码：

```ts
const app = new Elysia()
.use(cors()).use(swagger()).all("/api/auth/*", betterAuthView);

app.listen(process.env.BACKEND_PORT || 8000);

console.log(
  `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
);
```

我们的身份验证现在应该按预期工作！然后我们可以直接从前端访问我们的身份验证路由，如下所示：

```ts
import { createAuthClient } from "better-auth/client"
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL! 
})

export const signinGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  
  return data;
};
```

有关详细的客户端指南，请查看 [更好的身份验证前端](https://www.better-auth.com/docs/concepts/client)