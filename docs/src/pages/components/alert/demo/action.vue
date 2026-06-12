<docs lang="zh-CN">
可以在右上角自定义操作项。
</docs>

<docs lang="en-US">
Custom action.
</docs>

<template>
  <a-alert
    title="Success Tips"
    type="success"
    show-icon
    closable
  >
    <template #action>
      <a-button type="text" size="small">
        UNDO
      </a-button>
    </template>
  </a-alert>
  <br>
  <a-alert
    title="Error Text"
    show-icon
    description="Error Description Error Description Error Description Error Description"
    type="error"
  >
    <template #action>
      <a-button size="small" danger>
        Detail
      </a-button>
    </template>
  </a-alert>
  <br>
  <a-alert
    title="Warning Text"
    type="warning"
    closable
  >
    <template #action>
      <a-button size="small" type="text">
        Done
      </a-button>
    </template>
  </a-alert>
  <br>
  <a-alert
    title="Info Text"
    description="Info Description Info Description Info Description Info Description"
    type="info"
    closable
  >
    <template #action>
      <a-flex vertical gap="small" :style="{ minWidth: '80px' }">
        <a-button size="small" type="primary" block>
          Accept
        </a-button>
        <a-button size="small" danger ghost block>
          Decline
        </a-button>
      </a-flex>
    </template>
  </a-alert>
</template>
