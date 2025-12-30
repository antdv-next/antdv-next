<script setup lang="ts">
import * as all from '@antdv-next/icons/all'

const keys = Object.keys(all)
</script>

<template>
  <div>
    <h1>Icons Page</h1>
    <span>
      <a-space wrap>
        <template v-for="item in keys" :key="item">
          <div class="flex flex-col items-center">
            <component :is="(all as any)[item]" class="text-30px" />
            <span>{{ item }}</span>
          </div>

        </template>
      </a-space>

    </span>
  </div>
</template>

<style scoped>

</style>
