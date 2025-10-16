<script setup lang="ts">

</script>

<template>
  <a-flex gap="small" vertical>
    <a-config-provider
      :theme="{
        components: {
          Button: {
            algorithm: true,
            colorPrimary: '#1976d2',
            controlHeight: 36,
            primaryShadow:
              '0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)',
            fontWeight: 500,
            defaultBorderColor: 'rgba(25, 118, 210, 0.5)',
            colorText: '#1976d2',
            defaultColor: '#1976d2',
            borderRadius: 4,
            colorTextDisabled: 'rgba(0, 0, 0, 0.26)',
            colorBgContainerDisabled: 'rgba(0, 0, 0, 0.12)',
            contentFontSizeSM: 12,
          },
        },
      }"
    >
      <a-flex wrap gap="small">
        <a-button type="text">
          TEXT
        </a-button>
        <a-button type="primary">
          CONTAINED
        </a-button>
        <a-button>OUTLINED</a-button>
      </a-flex>
      <a-flex wrap gap="small">
        <a-button type="text" disabled>
          TEXT
        </a-button>
        <a-button type="primary" disabled>
          CONTAINED
        </a-button>
        <a-config-provider
          :theme="{
            components: {
              Button: {
                borderColorDisabled: 'rgba(0, 0, 0, 0.12)',
                colorBgContainerDisabled: 'transparent',
              },
            },
          }"
        >
          <a-button disabled>
            OUTLINED
          </a-button>
        </a-config-provider>
      </a-flex>
      <a-flex wrap gap="small">
        <a-button type="text" size="small">
          TEXT
        </a-button>
        <a-button type="primary" size="small">
          CONTAINED
        </a-button>
        <a-button size="small">
          OUTLINED
        </a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#FF0000',
        },
      }"
    >
      <a-flex gap="small" wrap>
        <a-button type="text">
          Text
        </a-button>
        <a-button type="link">
          Link
        </a-button>
        <a-button color="primary" variant="text">
          Primary Text
        </a-button>
        <a-button color="primary" variant="link">
          Primary Link
        </a-button>
      </a-flex>
    </a-config-provider>
    <a-config-provider
      :theme="{
        components: {
          Button: {
            paddingInline: 100,
            paddingInlineLG: 150,
            paddingInlineSM: 50,
          },
        },
      }"
    >
      <a-flex gap="small" vertical align="start">
        <a-button>Default Button</a-button>
        <a-button shape="round">
          Default Button
        </a-button>
        <a-button size="large">
          Default Button
        </a-button>
        <a-button shape="round" size="large">
          Default Button
        </a-button>
        <a-button size="small">
          Default Button
        </a-button>
        <a-button shape="round" size="small">
          Default Button
        </a-button>
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>
