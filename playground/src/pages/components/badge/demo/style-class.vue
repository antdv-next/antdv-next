<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Badge 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Badge by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
const badgeClasses = {
  indicator: 'custom-badge-indicator',
}

const ribbonClasses = {
  root: 'custom-ribbon-root',
}

const badgeStyles = {
  root: {
    borderRadius: '8px',
  },
}

const ribbonStyles = {
  indicator: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}

function badgeStylesFn(info: any) {
  if (info.props.size === 'default') {
    return {
      indicator: {
        fontSize: '14px',
        backgroundColor: '#696FC7',
      },
    }
  }
  return {}
}

function ribbonStylesFn(info: any) {
  if (info.props.color === '#696FC7') {
    return {
      content: {
        fontWeight: 'bold',
      },
      indicator: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-space size="large" vertical>
    <a-flex gap="middle">
      <a-badge size="small" :count="5" :classes="badgeClasses" :styles="badgeStyles">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="5" :classes="badgeClasses" :styles="badgeStylesFn">
        <a-avatar shape="square" size="large" />
      </a-badge>
    </a-flex>
    <a-flex vertical gap="middle">
      <a-badge-ribbon text="Custom Ribbon" :classes="ribbonClasses" :styles="ribbonStyles">
        <a-card title="Card with custom ribbon" size="small">
          This card has a customized ribbon with semantic classNames and styles.
        </a-card>
      </a-badge-ribbon>
      <a-badge-ribbon
        text="Custom Ribbon"
        color="#696FC7"
        :classes="ribbonClasses"
        :styles="ribbonStylesFn"
      >
        <a-card title="Card with custom ribbon" size="small">
          This card has a customized ribbon with semantic classNames and styles.
        </a-card>
      </a-badge-ribbon>
    </a-flex>
  </a-space>
</template>

<style>
.custom-badge-indicator {
  font-size: 10px;
}
.custom-ribbon-root {
  width: 400px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}
</style>
