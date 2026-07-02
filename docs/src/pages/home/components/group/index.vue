<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'

const props = defineProps<{
  id?: string
  title?: string
  titleColor?: string
  description?: string
  background?: string
  collapse?: boolean
  decoration?: any
  backgroundPrefetchList?: string[]
  extra?: any
}>()

const { token } = theme.useToken()

const backgroundStyle = computed(() => {
  if (!props.background)
    return {}
  if (props.background.startsWith('https'))
    return { backgroundImage: `url(${props.background})` }
  if (props.background.startsWith('linear-gradient'))
    return { backgroundImage: props.background }
  return { backgroundColor: props.background }
})
</script>

<template>
  <div
    class="antdv-home-group-container"
    :style="backgroundStyle"
  >
    <div class="antdv-home-group-decoration-container">
      <slot name="decoration" />
    </div>

    <div
      class="antdv-home-group-mask-layer"
      :style="{ paddingBlock: `${token?.marginFarSM ?? 80}px` }"
    >
      <div class="antdv-home-group-typography-wrapper text-center">
        <div class="antdv-home-group-title-row">
          <a-typography-title
            :id="id"
            :level="1"
            :style="{
              fontWeight: 900,
              color: titleColor,
              margin: 0,
              fontSize: `${token?.fontSizeHeading1}px`,
            }"
          >
            {{ title }}
          </a-typography-title>
          <div v-if="$slots.extra" class="antdv-home-group-extra">
            <slot name="extra" />
          </div>
        </div>
        <a-typography-paragraph
          :style="{
            color: titleColor,
            marginBottom: `${token?.marginFarXS ?? 48}px`,
          }"
        >
          {{ description }}
        </a-typography-paragraph>
      </div>

      <div :class="{ 'antdv-home-group-margin-style': !collapse }">
        <div v-if="$slots.default">
          <slot />
        </div>
        <div v-else class="antdv-home-group-without-children" />
      </div>
    </div>
  </div>
</template>

<style>
.antdv-home-group-container {
  position: relative;
  transition: all var(--ant-motion-duration-slow);
  background-size: cover;
  background-position: 50% 0%;
  background-repeat: no-repeat;
}

.antdv-home-group-decoration-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.antdv-home-group-mask-layer {
  z-index: 1;
  position: relative;
}

.antdv-home-group-typography-wrapper {
  text-align: center;
}

.antdv-home-group-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.antdv-home-group-extra {
  display: flex;
  align-items: center;
}

.antdv-home-group-margin-style {
  max-width: 1208px;
  margin-inline: auto;
  box-sizing: border-box;
  padding-inline: var(--ant-margin-xxl);
}

.antdv-home-group-without-children {
  min-height: 300px;
  border-radius: var(--ant-border-radius-lg);
  background-color: #e9e9e9;
}
</style>
