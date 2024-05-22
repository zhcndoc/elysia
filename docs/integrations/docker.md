---
title: Docker
head:
  - - meta
    - property: 'og:title'
      content: Docker - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 您可以使用以下 Dockerfile 与 Docker 一起使用 Elysia，方法是使用 oven/bun，或者从页面上复制片段。

  - - meta
    - property: 'og:description'
      content: 您可以使用以下 Dockerfile 与 Docker 一起使用 Elysia，方法是使用 oven/bun，或者从页面上复制片段。
---

# Docker

使用以下 Dockerfile 使用 Docker 部署 Elysia：

```docker
FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000
```

## Distroless

如果您想使用 Distroless：

```docker
FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 3000
```

## Development

要在 Docker 中开发 Elysia，您可以使用以下最小 docker compose 模板：

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    image: "oven/bun"
    # 覆盖默认entrypoint，允许我们在启动服务器之前执行`bun install`
    entrypoint: []
    # 在以观察模式启动开发服务器之前执行`bun install`
    command: "/bin/sh -c 'bun install && bun run --watch src/index.ts'"
    # 暴露正确的端口
    ports: ["3000:3000"]
    # 设置主机挂载的卷以将更改同步到容器
    volumes: ["./:/home/bun/app"]
```