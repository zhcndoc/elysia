---
title: React Email - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: React Email - ElysiaJS

  - - meta
    - name: 'description'
      content: 由于 Elysia 使用 Bun 作为运行环境，我们可以直接使用 React Email 并将 JSX 导入到我们的代码中以发送电子邮件。

  - - meta
    - name: 'og:description'
      content: 由于 Elysia 使用 Bun 作为运行环境，我们可以直接使用 React Email 并将 JSX 导入到我们的代码中以发送电子邮件。
---

# React Email
React Email 是一个库，允许您使用 React 组件创建电子邮件。

由于 Elysia 使用 Bun 作为运行环境，我们可以直接编写一个 React Email 组件，并将 JSX 直接导入到我们的代码中以发送电子邮件。

## 安装
要安装 React Email，请运行以下命令：

```bash
bun add -d react-email
bun add @react-email/components react react-dom
```

然后在 `package.json` 中添加以下脚本：
```json
{
  "scripts": {
    "email": "email dev --dir src/emails"
  }
}
```

我们建议将电子邮件模板添加到 `src/emails` 目录中，因为我们可以直接导入 JSX 文件。

### TypeScript
如果您使用 TypeScript，可能需要在 `tsconfig.json` 中添加以下内容：

```json
{
  "compilerOptions": {
	"jsx": "react"
  }
}
```

## 您的第一封电子邮件
创建文件 `src/emails/otp.tsx`，并输入以下代码：

```tsx
import * as React from 'react'
import { Tailwind, Section, Text } from '@react-email/components'

export default function OTPEmail({ otp }: { otp: number }) {
    return (
        <Tailwind>
            <Section className="flex justify-center items-center w-full min-h-screen font-sans">
                <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-gray-50">
                    <Text className="text-xs font-medium text-violet-500">
                        验证您的电子邮件地址
                    </Text>
                    <Text className="text-gray-500 my-0">
                        使用以下代码验证您的电子邮件地址
                    </Text>
                    <Text className="text-5xl font-bold pt-2">{otp}</Text>
                    <Text className="text-gray-400 font-light text-xs pb-4">
                        此代码在 10 分钟内有效
                    </Text>
                    <Text className="text-gray-600 text-xs">
                        感谢加入我们
                    </Text>
                </Section>
            </Section>
        </Tailwind>
    )
}

OTPEmail.PreviewProps = {
    otp: 123456
}
```

您可能会注意到我们使用了 `@react-email/components` 来创建电子邮件模板。

该库提供了一组与邮件客户端（例如 Gmail、Outlook 等）兼容的组件，包括 **使用 Tailwind 进行样式设置**。

我们还向 `OTPEmail` 函数添加了 `PreviewProps`。这仅在我们在 PLAYGROUND 上预览电子邮件时适用。

## 预览您的电子邮件
要预览您的电子邮件，请运行以下命令：

```bash
bun email
```

这将打开一个浏览器窗口，显示您的电子邮件预览。

![React Email playground showing an OTP email we have just written](/recipe/react-email/email-preview.webp)

## 发送电子邮件
要发送电子邮件，我们可以使用 `react-dom/server` 来渲染电子邮件，然后使用首选提供商进行发送：

::: code-group

```tsx [Nodemailer]
import { Elysia, t } from 'elysia'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import OTPEmail from './emails/otp'

import nodemailer from 'nodemailer' // [!code ++]

const transporter = nodemailer.createTransport({ // [!code ++]
  	host: 'smtp.gehenna.sh', // [!code ++]
  	port: 465, // [!code ++]
  	auth: { // [!code ++]
  		user: 'makoto', // [!code ++]
  		pass: '12345678' // [!code ++]
  	} // [!code ++]
}) // [!code ++]

new Elysia()
	.get('/otp', async async ({ body }) => {
		// 随机生成 100,000 到 999,999 之间的数字
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

		const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await transporter.sendMail({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: '验证您的电子邮件地址', // [!code ++]
            html, // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

``` tsx [Resend]
import { Elysia, t } from 'elysia'

import OTPEmail from './emails/otp'

import Resend from 'resend' // [!code ++]

const resend = new Resend('re_123456789') // [!code ++]

new Elysia()
	.get('/otp', async ({ body }) => {
		// 随机生成 100,000 到 999,999 之间的数字
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

        await resend.emails.send({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: '验证您的电子邮件地址', // [!code ++]
            html: <OTPEmail otp={otp} />, // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

```tsx [AWS SES]
import { Elysia, t } from 'elysia'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import OTPEmail from './emails/otp'

import { type SendEmailCommandInput, SES } from '@aws-sdk/client-ses' // [!code ++]
import { fromEnv } from '@aws-sdk/credential-providers' // [!code ++]

const ses = new SES({ // [!code ++]
    credentials: // [!code ++]
        process.env.NODE_ENV === 'production' ? fromEnv() : undefined // [!code ++]
}) // [!code ++]

new Elysia()
	.get('/otp', async ({ body }) => {
		// 随机生成 100,000 到 999,999 之间的数字
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

		const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await ses.sendEmail({ // [!code ++]
            Source: 'ibuki@gehenna.sh', // [!code ++]
            Destination: { // [!code ++]
                ToAddresses: [body] // [!code ++]
            }, // [!code ++]
            Message: { // [!code ++]
                Body: { // [!code ++]
                    Html: { // [!code ++]
                        Charset: 'UTF-8', // [!code ++]
                        Data: html // [!code ++]
                    } // [!code ++]
                }, // [!code ++]
                Subject: { // [!code ++]
                    Charset: 'UTF-8', // [!code ++]
                    Data: '验证您的电子邮件地址' // [!code ++]
                } // [!code ++]
            } // [!code ++]
        } satisfies SendEmailCommandInput) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

``` tsx [Sendgrid]
import { Elysia, t } from 'elysia'

import OTPEmail from './emails/otp'

import sendgrid from "@sendgrid/mail" // [!code ++]

sendgrid.setApiKey(process.env.SENDGRID_API_KEY) // [!code ++]

new Elysia()
	.get('/otp', async ({ body }) => {
		// 随机生成 100,000 到 999,999 之间的数字
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

    	const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await sendgrid.send({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: '验证您的电子邮件地址', // [!code ++]
            html // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

:::

::: tip
注意，我们可以直接导入电子邮件组件，这要归功于 Bun
:::

您可以在 [React Email Integration](https://react.email/docs/integrations/overview) 中查看所有可用的 React Email 集成，并在 [React Email documentation](https://react.email/docs) 中了解更多信息。
