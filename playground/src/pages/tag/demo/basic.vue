<script setup lang="ts">
function preventDefault(e: Event) {
  e.preventDefault()
}
</script>

<template>
  <a-tag>
    Tag 1
  </a-tag>

  <a-tag>
    <a
      href="https://github.com/ant-design/ant-design/issues/1862"
      target="_blank"
      rel="noopener noreferrer"
    >
      Link
    </a>
  </a-tag>
  <a-tag close-icon @close="preventDefault">
    Prevent Default
  </a-tag>
</template>
