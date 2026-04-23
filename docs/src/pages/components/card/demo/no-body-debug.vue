<script setup lang="ts">
const cover = 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'
</script>

<template>
  <a-card style="width: 300px">
    <template #cover>
      <img alt="example" :src="cover">
    </template>
    <template #actions>
      <span key="setting">setting</span>
      <span key="edit">edit</span>
    </template>
  </a-card>
</template>
