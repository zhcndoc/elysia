<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
</script>

<Deck>
    <Card title="关键概念（5分钟）" href="/key-concept">
    	Elysia的核心概念以及如何使用它。
    </Card>
</Deck>

# 与其他框架的比较

Elysia设计得直观且易于使用，尤其适合熟悉其他Web框架的用户。

如果你使用过Express、Fastify或Hono等流行框架，你会发现Elysia也很容易上手，仅有少许差异。

<Deck>
	<Card title="来自Express" href="/migrate/from-express">
		Express与Elysia的对比
	</Card>
    <Card title="来自Fastify" href="/migrate/from-fastify">
  		Fastify与Elysia的对比
    </Card>
    <Card title="来自Hono" href="/migrate/from-hono">
  		Hono与Elysia的对比
    </Card>
    <Card title="来自tRPC" href="/migrate/from-trpc">
  		tRPC与Elysia的对比
    </Card>
</Deck>
