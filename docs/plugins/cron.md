---
title: Cron 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Cron 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加对在 Elysia 服务器上运行 cronjob 的支持的插件。通过 "bun add @elysiajs/cron" 安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 添加自定义跨源资源共享行为支持的插件。通过 "bun add @elysiajs/cors" 安装插件。
---

# Cron 插件

此插件为 Elysia 服务器提供运行 cronjob 的支持。

通过以下命令安装：

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

上述代码将在每 10 秒记录一次 `heartbeat`。

## cron

为 Elysia 服务器创建一个 cronjob。

类型：

```
cron(config: CronConfig, callback: (Instance['store']) => void): this
```

`CronConfig` 接受以下参数：

### name

要注册到 `store` 的作业名称。

这将使用指定名称将 cron 实例注册到 `store`，可以在后续过程中引用，例如停止该作业。

### pattern

通过 [cron 语法](https://en.wikipedia.org/wiki/Cron) 指定的作业运行时间，格式如下：

```
┌────────────── 秒（可选）
│ ┌──────────── 分钟
│ │ ┌────────── 小时
│ │ │ ┌──────── 每月的某天
│ │ │ │ ┌────── 月
│ │ │ │ │ ┌──── 每周的某天
│ │ │ │ │ │
* * * * * *
```

可以通过 [Crontab Guru](https://crontab.guru/) 等工具生成。

---

此插件使用 [cronner](https://github.com/hexagon/croner) 扩展了 Elysia 的 cron 方法。

以下是 cronner 接受的配置。

### timezone

以 Europe/Stockholm 格式的时区。

### startAt

作业的调度开始时间。

### stopAt

作业的调度停止时间。

### maxRuns

最大执行次数。

### catch

即使触发的函数抛出未处理的错误也继续执行。

### interval

执行之间的最小间隔，单位为秒。

## 模式

以下是使用该插件的常见模式。

## 停止 cronjob

您可以通过访问注册到 `store` 的 cronjob 名称手动停止 cronjob。

```typescript
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

const app = new Elysia()
    .use(
        cron({
            name: 'heartbeat',
            pattern: '*/1 * * * * *',
            run() {
                console.log("Heartbeat")
            }
        })
    )
    .get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'Stop heartbeat'
    })
    .listen(3000)
```

## 预定义模式

您可以使用来自 `@elysiajs/cron/schedule` 的预定义模式。
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
        })
    )
    .get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'Stop heartbeat'
    })
    .listen(3000)
```


### 函数

函数  | 描述
------------- | -------------
`.everySeconds(2)`  |  每 2 秒运行任务
`.everyMinutes(5)`  |  每 5 分钟运行任务
`.everyHours(3)`  |  每 3 小时运行任务
`.everyHoursAt(3, 15)`  |   每 3 小时在第 15 分钟运行任务
`.everyDayAt('04:19')`  |   每天 04:19 运行任务
`.everyWeekOn(Patterns.MONDAY, '19:30')`  |   每周一 19:30 运行任务
`.everyWeekdayAt('17:00')`  |  每周一至周五 17:00 运行任务
`.everyWeekendAt('11:00')`  |  每周六和周日 11:00 运行任务

### 函数别名与常量

函数  | 常量
------------- | -------------
`.everySecond()`  |  EVERY_SECOND
`.everyMinute()`  |  EVERY_MINUTE
`.hourly()`  |  EVERY_HOUR
`.daily()`  |  EVERY_DAY_AT_MIDNIGHT
`.everyWeekday()`  |  EVERY_WEEKDAY
`.everyWeekend()`  |  EVERY_WEEKEND
`.weekly()`  |  EVERY_WEEK
`.monthly()`  |  EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT
`.everyQuarter()`  |  EVERY_QUARTER
`.yearly()`  |  EVERY_YEAR

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
  `.EVERY_DAY_AT_9AM` | `0 09 * * *`
  `.EVERY_DAY_AT_10AM` | `0 10 * * *`
  `.EVERY_DAY_AT_11AM` | `0 11 * * *`
  `.EVERY_DAY_AT_NOON` | `0 12 * * *`
  `.EVERY_DAY_AT_1PM` | `0 13 * * *`
  `.EVERY_DAY_AT_2PM` | `0 14 * * *`
  `.EVERY_DAY_AT_3PM` | `0 15 * * *`
  `.EVERY_DAY_AT_4PM` | `0 16 * * *`
  `.EVERY_DAY_AT_5PM` | `0 17 * * *`
  `.EVERY_DAY_AT_6PM` | `0 18 * * *`
  `.EVERY_DAY_AT_7PM` | `0 19 * * *`
  `.EVERY_DAY_AT_8PM` | `0 20 * * *`
  `.EVERY_DAY_AT_9PM` | `0 21 * * *`
  `.EVERY_DAY_AT_10PM` | `0 22 * * *`
  `.EVERY_DAY_AT_11PM` | `0 23 * * *`
  `.EVERY_DAY_AT_MIDNIGHT` | `0 0 * * *`
  `.EVERY_WEEK` | `0 0 * * 0`
  `.EVERY_WEEKDAY` | `0 0 * * 1-5`
  `.EVERY_WEEKEND` | `0 0 * * 6,0`
  `.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT` | `0 0 1 * *`
  `.EVERY_1ST_DAY_OF_MONTH_AT_NOON` | `0 12 1 * *`
  `.EVERY_2ND_HOUR` | `0 */2 * * *`
  `.EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM` | `0 1-23/2 * * *`
  `.EVERY_2ND_MONTH` | `0 0 1 */2 *`
  `.EVERY_QUARTER` | `0 0 1 */3 *`
  `.EVERY_6_MONTHS` | `0 0 1 */6 *`
  `.EVERY_YEAR` | `0 0 1 1 *`
  `.EVERY_30_MINUTES_BETWEEN_9AM_AND_5PM` | `0 */30 9-17 * * *`
  `.EVERY_30_MINUTES_BETWEEN_9AM_AND_6PM` | `0 */30 9-18 * * *`
  `.EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM` | `0 */30 10-19 * * *`
