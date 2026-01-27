---
category: Components
group: Other
title: App
description: Application wrapper for some global usages.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HJz8SZos2wgAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oC92TK44Ex8AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- Provide reset styles based on `.ant-app` element.
- You could use static methods of `message/notification/Modal` form `useApp` without writing `contextHolder` manually.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/config.vue">Hooks config</demo>
</demo-group>

```html
<!-- myPage.vue -->
<template>
  <a-space>
    <a-button type="primary" @click="showMessage">Open message</a-button>
    <a-button type="primary" @click="showModal">Open modal</a-button>
    <a-button type="primary" @click="showNotification">Open notification</a-button>
  </a-space>
</template>

<script setup lang="ts">
  import { App } from 'ant-design-vue';

  const { message, modal, notification } = App.useApp();

  const showMessage = () => {
    message.success('Success!');
  };

  const showModal = () => {
    modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
    });
  };

  const showNotification = () => {
    notification.info({
      message: `Notification topLeft`,
      description: 'Hello, Antdv Next!!',
      placement: 'topLeft',
    });
  };
</script>
```

```html
<!-- myPage2.vue -->
<script setup lang="ts">
  import { App } from 'antdv-next'

  const { message, modal, notification } = App.useApp();

  const showMessage = () => {
    message.success('Success!');
  };

  const showNotification = () => {
    notification.info({
      title: 'Notification',
      description: 'Hello, Antdv Next!!',
    });
  };
</script>

<template>
  <a-space wrap>
    <a-button type="primary" @click="showMessage">
      Message for only one
    </a-button>
    <a-button type="primary" @click="showNotification">
      Notification for bottomLeft
    </a-button>
  </a-space>
</template>

```

## How to use

### Basic usage

App provides upstream and downstream method calls through `provide/inject`, because useApp needs to be used as a subcomponent, we recommend encapsulating App at the top level in the application.

Note: App.useApp must be available under App.

#### Embedded usage scenarios (if not necessary, try not to do nesting)

```html
<a-app>
  <a-space>
    ...
    <a-app>...</a-app>
  </a-space>
</a-app>
```

#### Sequence with ConfigProvider

The App component can only use the token in the `ConfigProvider`, if you need to use the Token, the ConfigProvider and the App component must appear in pairs.

```html
<a-config-provider theme="{{ ... }}">
  <a-app>...</a-app>
</a-config-provider>
```

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| message | Global config for Message | MessageConfig | - | |
| notification | Global config for Notification | NotificationConfig | - | |
| component | Config render element, if `false` will not create DOM node | any | div | |

## Design Token

<ComponentTokenTable component="App"></ComponentTokenTable>

## FAQ

### CSS Var doesn't work inside `<a-app :component="false">` {#faq-css-var-component-false}

Make sure the App `component` is a valid html tag, so when you're turning on CSS variables, there's a container to hold the CSS class name. If not set, it defaults to the `div` tag. If set to `false`, no additional DOM nodes will be created, and no default styles will be provided.
