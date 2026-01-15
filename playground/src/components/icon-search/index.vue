<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const IconSearch = defineAsyncComponent(() => import('./IconSearch.vue'))
</script>

<template>
  <Suspense>
    <template #fallback>
      <div>
        <div class="search-wrapper">
          <a-skeleton-button active style="width: 100%; height: 40px" />
          <a-skeleton-input active style="width: 100%; height: 40px" />
        </div>
        <a-skeleton-button active style="margin: 28px 0 10px; width: 100px" />
        <div class="fallback-wrapper">
          <div v-for="i in 24" :key="i" class="skeleton-wrapper">
            <a-skeleton-node active style="height: 110px; width: 100%" />
          </div>
        </div>
      </div>
    </template>
    <IconSearch />
  </Suspense>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  gap: 16px;
}
.search-wrapper > *:first-child {
  flex: 0 0 328px;
}
.search-wrapper > *:last-child {
  flex: 1;
}
.fallback-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.fallback-wrapper > * {
  flex: 0 0 15%;
  margin: 4px 0;
}
.skeleton-wrapper {
  text-align: center;
}
.skeleton-wrapper > * {
  width: 100%;
}
</style>
