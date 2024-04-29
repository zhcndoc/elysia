---
title: Cron Plugin
head:
    - - meta
      - property: 'og:title'
        content: Cron Plugin - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for running cronjob in Elysia server. Start by installing the plugin with "bun add @elysiajs/cron".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".
---

# Cron 插件

此插件为 Elysia 服务器添加了运行 cronjob 的支持。

安装方法：

```bash
bun add @elysiajs/cron
```

然后使用它：

```typescript
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

new Elysia()
    .use(
        cron({
            name: 'heartbeat',
            pattern: '*/10 * * * * *',
            run() {
                console.log('Heartbeat')
            }
        })
    )
    .listen(3000)
```

上述代码将每 10 秒记录 `Heartbeat`。

## cron

为 Elysia 服务器创建一个 cronjob。

类型：

```
cron(config: CronConfig, callback: (Instance['store']) => void): this
```

`CronConfig` 接受以下指定的参数：

### name

要注册的作业名称到 `store` 中。

这将使用指定的名称将 cron 实例注册到 `store` 中，可以在后续进程中用于引用，例如停止作业。

### pattern

根据 [cron 语法](https://en.wikipedia.org/wiki/Cron)指定的作业运行时间，格式如下：

```
┌────────────── second (optional)
│ ┌──────────── minute
│ │ ┌────────── hour
│ │ │ ┌──────── day of the month
│ │ │ │ ┌────── month
│ │ │ │ │ ┌──── day of week
│ │ │ │ │ │
* * * * * *
```

可以使用诸如 [Crontab Guru](https://crontab.guru/) 的工具生成。

---

此插件使用 [cronner](https://github.com/hexagon/croner) 将 cron 方法扩展到 Elysia。

以下是 cronner 接受的配置。

### timezone

以 Europe/Stockholm 格式的时区

### startAt

作业的计划开始时间

### stopAt

作业的计划停止时间

### maxRuns

最大执行次数

### catch

即使触发的函数抛出未处理的错误，也要继续执行。

### interval

执行之间的最小间隔，以秒为单位。

## Pattern

下面是使用该插件的常用模式。

## 停止 cron 作业

可以通过访问注册到 `store` 的 cron 作业名称来手动停止 cron 作业。

```typescript
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

const app = new Elysia()
    use(
        cron({
            name: 'heartbeat',
            pattern: '*/1 * * * * *',
            run() {
                console.log("Heartbeat")
            }
        }
    )
    .get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'Stop heartbeat'
    })
    .listen(3000)
```

## 预定义模式

可以使用 `@elysiajs/cron/schelude` 中的预定义模式。

```typescript
import { Elysia } from 'elysia'
import { cron, Patterns } from '@elysiajs/cron'

const app = new Elysia()
    .use(
        cron({
            name: 'heartbeat',
            pattern: Patterns.everySecond(),
            run() {
                console.log("Heartbeat")
            }
        }
    )
    .get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'Stop heartbeat'
    })
    .listen(3000)
```


### 函数

函数 | 描述
------------- | -------------
`.everySeconds(2)` | 每 2 秒运行一次任务
`.everyMinutes(5)` | 每 5 分钟运行一次任务
`.everyHours(3)` | 每 3 小时运行一次任务
`.everyHoursAt(3, 15)` | 每天在 3 点 15 分运行一次任务
`.everyDayAt('04:19')` | 每天在 04:19 运行一次任务
`.everyWeekOn(Patterns.MONDAY, '19:30')` | 每周一在 19:30 运行任务
`.everyWeekdayAt('17:00')` | 每周一至周五，在 17:00 运行任务
`.everyWeekendAt('11:00')` | 每周六和周日在 11:00 运行任务

### 函数别名常量

函数 | 常量
------------- | -------------
`.everySecond()` | EVERY_SECOND
`.everyMinute()` | EVERY_MINUTE
`.hourly()` | EVERY_HOUR
`.daily()` | EVERY_DAY_AT_MIDNIGHT
`.everyWeekday()` | EVERY_WEEKDAY
`.everyWeekend()` | EVERY_WEEKEND
`.weekly()` | EVERY_WEEK
`.monthly()` | EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT
`.everyQuarter()` | EVERY_QUARTER
`.yearly()` | EVERY_YEAR

### 常量

 常量 | 模式
------------- | -------------
`.EVERY_SECOND` | `* * * * * *`
`.EVERY_5_SECONDS` | `*/5 * * * * *`
`.EVERY_10_SECONDS` | `*/10 * * * * *`
`.EVERY_30_SECONDS` | `*/30 * * * * *`
`.EVERY_MINUTE` | `*/1 * * * *`
`.EVERY_5_MINUTES` | `0 */5 * * * *`
`.EVERY_10_MINUTES` | `0 */10 * * * *`
`.EVERY_30_MINUTES` | `0 */30 * * * *`
`.EVERY_HOUR` | `0 0-23/1 * * *`
`.EVERY_2_HOURS` | `0 0-23/2 * * *`
`.EVERY_3_HOURS` | `0 0-23/3 * * *`
`.EVERY_4_HOURS` | `0 0-23/4 * * *`
`.EVERY_5_HOURS` | `0 0-23/5 * * *`
`.EVERY_6_HOURS` | `0 0-23/6 * * *`
`.EVERY_7_HOURS` | `0 0-23/7 * * *`
`.EVERY_8_HOURS` | `0 0-23/8 * * *`
`.EVERY_9_HOURS` | `0 0-23/9 * * *`
`.EVERY_10_HOURS` | `0 0-23/10 * * *`
`.EVERY_11_HOURS` | `0 0-23/11 * * *`
`.EVERY_12_HOURS` | `0 0-23/12 * * *`
`.EVERY_DAY_AT_1AM` | `0 01 * * *`
`.EVERY_DAY_AT_2AM` | `0 02 * * *`
`.EVERY_DAY_AT_3AM` | `0 03 * * *`
`.EVERY_DAY_AT_4AM` | `0 04 * * *`
`.EVERY_DAY_AT_5AM` | `0 05 * * *`
`.EVERY_DAY_AT_6AM` | `0 06 * * *`
`.EVERY_DAY_AT_7AM` | `0 07 * * *`
`.EVERY_DAY_AT_8AM` | `0 08 * * *`
`.EVERY_DAY_AT_9AM` | `0 09 * *