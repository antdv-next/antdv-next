<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Input 的[语义化结构](#semantic-input)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-input) style of Input by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
  import type { InputOTPProps, InputPasswordProps, InputProps, InputSearchProps, TextAreaProps } from 'antdv-next'

  const classes: InputProps['classes'] = {
    root: 'effect',
  };

  const stylesFn: InputProps['styles'] = (info) => {
    if (info.props.size === 'middle') {
      return {
        root: {
          borderColor: '#696FC7',
        },
      } satisfies InputProps['styles'];
    }
    return {};
  };

  const stylesFnTextArea: TextAreaProps['styles'] = (info) => {
    if (info.props.showCount) {
      return {
        root: { borderColor: '#BDE3C3' },
        textarea: { resize: 'none' },
        count: { color: '#BDE3C3' },
      } satisfies TextAreaProps['styles'];
    }
    return {};
  };

  const stylesFnPassword: InputPasswordProps['styles'] = (info) => {
    if (info.props.size === 'middle') {
      return {
        root: {
          borderColor: '#F5D3C4',
        },
      } satisfies InputPasswordProps['styles'];
    }
    return {};
  };

  const stylesFnOTP: InputOTPProps['styles'] = (info) => {
    if (info.props.size === 'middle') {
      return {
        input: {
          borderColor: '#6E8CFB',
          width: '32px',
        },
      } satisfies InputOTPProps['styles'];
    }
    return {};
  };

  const stylesFnSearch: InputSearchProps['styles'] = (info) => {
    if (info.props.size === 'large') {
      return {
        root: { color: '#4DA8DA' },
        input: { color: '#4DA8DA', borderColor: '#4DA8DA' },
        prefix: { color: '#4DA8DA' },
        suffix: { color: '#4DA8DA' },
        count: { color: '#4DA8DA' },
        button: {
          root: { color: '#4DA8DA', borderColor: '#4DA8DA' },
          icon: { color: '#4DA8DA' },
        },
      } satisfies InputSearchProps['styles'];
    }
    return {};
  };
</script>

<template>
  <a-flex vertical gap="large">
    <a-input :classes="classes" placeholder="Object" name="input-object" />
    <a-input :classes="classes" :styles="stylesFn" placeholder="Function" size="middle" name="input-fn" />
    <a-textarea :classes="classes" :styles="stylesFnTextArea" placeholder="Textarea" show-count name="textarea-fn" />
    <a-input-password :classes="classes" :styles="stylesFnPassword" placeholder="Password" size="middle" name="password-fn" />
    <a-input-otp :classes="classes" :styles="stylesFnOTP" size="middle" :length="6" separator="*" name="otp-fn" />
    <a-input-search :classes="classes" :styles="stylesFnSearch" placeholder="Search" size="large" name="search-fn" />
  </a-flex>
</template>

<style scoped>
.effect {
  border-width: 1px;
  border-radius: 6px;
  -webkit-transition: box-shadow 0.2s;
  transition: box-shadow 0.2s;
}
.effect:focus-visible {
  border-color: lab(66.128% 0 0);
  box-shadow: 0 0 0 4px color-mix(in oklab, lab(66.128% 0 0) 50%, transparent);
}
.effect:hover {
  border-radius: 1px solid #d9d9d9;
}
</style>
