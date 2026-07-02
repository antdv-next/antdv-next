<docs lang="zh-CN">
自定义描述文案。
</docs>

<docs lang="en-US">
Customize the description text.
</docs>

<template>
  <a-flex gap="middle" vertical>
    <a-flex gap="middle">
      <a-spin description="Loading" size="small">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </a-spin>
      <a-spin description="Loading">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </a-spin>
      <a-spin description="Loading" size="large">
        <div style="padding: 50px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;" />
      </a-spin>
    </a-flex>
    <a-spin description="Loading...">
      <a-alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </a-spin>
  </a-flex>
</template>
