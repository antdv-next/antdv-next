<docs lang="zh-CN">
通过 `duration` 控制流光完成一圈所需时间，单位为秒，默认值为 6 秒。
</docs>

<docs lang="en-US">
Use `duration` to control how many seconds the beam takes to complete one loop. The default is 6 seconds.
</docs>

<script setup lang="ts">
const durations = [
  {
    name: 'Fast',
    seconds: 3,
    description: 'A quick loop for temporary highlights and active modules.',
  },
  {
    name: 'Default',
    seconds: 6,
    description: 'The original pacing for most emphasized containers.',
  },
  {
    name: 'Slow',
    seconds: 12,
    description: 'A calmer loop for persistent panels and ambient surfaces.',
  },
]
</script>

<template>
  <a-flex :gap="16" wrap>
    <template v-for="duration in durations" :key="duration.seconds">
      <div style="width: 220px">
        <a-border-beam :duration="duration.seconds">
          <a-card :title="duration.name">
            <template #extra>
              <a-tag variant="filled">
                {{ duration.seconds }}s
              </a-tag>
            </template>
            <a-typography-text>{{ duration.description }}</a-typography-text>
          </a-card>
        </a-border-beam>
      </div>
    </template>
  </a-flex>
</template>
