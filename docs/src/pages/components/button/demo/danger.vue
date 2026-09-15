<docs lang="zh-CN">
`danger` 属性使按钮呈现危险语义样式，可与任意按钮类型组合使用。
</docs>

<docs lang="en-US">
The `danger` property renders a button with danger semantics and can be combined with any button type.
</docs>

<template>
  <a-flex wrap gap="small">
    <a-button type="primary" danger>
      Primary
    </a-button>
    <a-button danger>
      Default
    </a-button>
    <a-button type="dashed" danger>
      Dashed
    </a-button>
    <a-button type="text" danger>
      Text
    </a-button>
    <a-button type="link" danger>
      Link
    </a-button>
  </a-flex>
</template>
