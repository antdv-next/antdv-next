<docs lang="zh-CN">
封装 `Avatar.Group`，添加 `overflowInFinal` 属性。开启后 `max.count` 表示总共显示的元素数量，会预留 1 个位置给溢出指示器。
</docs>

<docs lang="en-US">
Wrap `Avatar.Group` to add `overflowInFinal` prop. When enabled, `max.count` represents the total number of elements to display and reserves 1 slot for the overflow indicator.
</docs>

<script setup lang="ts">
import type { AvatarGroupProps } from 'antdv-next'
import type { FunctionalComponent, VNode } from 'vue'
import { AvatarGroup } from 'antdv-next'
import { Fragment, h, ref } from 'vue'

function flattenChildren(nodes: VNode[]): VNode[] {
  return nodes.flatMap(node =>
    node.type === Fragment && Array.isArray(node.children)
      ? flattenChildren(node.children as VNode[])
      : [node],
  )
}

const AvatarGroupOverflow: FunctionalComponent<AvatarGroupProps & { overflowInFinal?: boolean }> = (props, { slots, attrs }) => {
  const mergedMaxCount = props.max?.count ?? 3
  const children = flattenChildren(slots.default?.() ?? [])
  const reserveOverflowSlot = props.overflowInFinal && mergedMaxCount < children.length
  return h(
    AvatarGroup,
    {
      ...attrs,
      max: reserveOverflowSlot
        ? { ...props.max, count: Math.max(1, mergedMaxCount - 1) }
        : props.max,
    },
    () => children,
  )
}
AvatarGroupOverflow.props = ['overflowInFinal', 'max']

const avatarCount = ref(4)
const overflowInFinal = ref(true)
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex :gap="24" align="center">
      <span>Avatar count: </span>
      <a-input-number
        v-model:value="avatarCount"
        style="width: 120px"
        :min="2"
        :max="10"
        aria-label="Avatar count"
        mode="spinner"
      />
    </a-flex>
    <a-flex :gap="8" align="center">
      <span>overflowInFinal: </span>
      <a-switch v-model:checked="overflowInFinal" aria-label="overflowInFinal" />
    </a-flex>
    <AvatarGroupOverflow
      :max="{
        count: 3,
        style: { backgroundColor: '#52c41a', color: '#fff' },
      }"
      :overflow-in-final="overflowInFinal"
    >
      <a-avatar v-for="i in avatarCount" :key="i" style="background-color: #f56a00;">
        {{ String.fromCharCode(64 + i) }}
      </a-avatar>
    </AvatarGroupOverflow>
  </a-flex>
</template>
