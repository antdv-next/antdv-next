<docs lang="zh-CN">
对比 Input 子组件通过 `input`、子组件全局配置和组件属性设置变体的效果。
</docs>

<docs lang="en-US">
Compare Input subcomponent variants configured through `input`, subcomponent global config, and component props.
</docs>

<template>
  <a-flex vertical gap="large">
    <a-flex vertical gap="small">
      <a-typography-text strong>
        Input.Search
      </a-typography-text>
      <a-typography-text code>
        ConfigProvider input
      </a-typography-text>
      <a-config-provider :input="{ variant: 'filled' }">
        <a-input-search placeholder="Filled" />
      </a-config-provider>
      <a-typography-text code>
        ConfigProvider inputSearch
      </a-typography-text>
      <a-config-provider :input-search="{ variant: 'filled' }">
        <a-input-search placeholder="Filled" />
      </a-config-provider>
      <a-typography-text code>
        Component prop
      </a-typography-text>
      <a-input-search placeholder="Filled" variant="filled" />
    </a-flex>

    <a-flex vertical gap="small">
      <a-typography-text strong>
        Input.Password
      </a-typography-text>
      <a-typography-text code>
        ConfigProvider input
      </a-typography-text>
      <a-config-provider :input="{ variant: 'filled' }">
        <a-input-password placeholder="Filled" />
      </a-config-provider>
      <a-typography-text code>
        ConfigProvider inputPassword
      </a-typography-text>
      <a-config-provider :input-password="{ variant: 'filled' }">
        <a-input-password placeholder="Filled" />
      </a-config-provider>
      <a-typography-text code>
        Component prop
      </a-typography-text>
      <a-input-password placeholder="Filled" variant="filled" />
    </a-flex>

    <a-flex vertical gap="small">
      <a-typography-text strong>
        Input.OTP
      </a-typography-text>
      <a-typography-text code>
        ConfigProvider input
      </a-typography-text>
      <a-config-provider :input="{ variant: 'filled' }">
        <a-input-otp default-value="111111" />
      </a-config-provider>
      <a-typography-text code>
        ConfigProvider otp
      </a-typography-text>
      <a-config-provider :otp="{ variant: 'filled' }">
        <a-input-otp default-value="222222" />
      </a-config-provider>
      <a-typography-text code>
        Component prop
      </a-typography-text>
      <a-input-otp default-value="333333" variant="filled" />
    </a-flex>
  </a-flex>
</template>
