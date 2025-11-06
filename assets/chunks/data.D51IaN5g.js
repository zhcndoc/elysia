const e=`import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)

console.log(
	\`🦊 Elysia is running at \${app.server?.hostname}:\${app.server?.port}\`
)
`,t=[{title:`Return "Hello Elysia!"`,description:`Modify the code to make the server respond with "Hello Elysia!" instead of "Hello World!".`,test:{request:{url:`/`},response:{body:`Hello Elysia!`}}}];export{t as n,e as t};