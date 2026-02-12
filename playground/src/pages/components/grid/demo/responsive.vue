<docs lang="zh-CN">
参照 Bootstrap 的 [响应式设计](http://getbootstrap.com/css/#grid-media-queries)，预设七个响应尺寸：`xs` `sm` `md` `lg` `xl` `xxl` `xxxl`。
</docs>

<docs lang="en-US">
Referring to the Bootstrap [responsive design](http://getbootstrap.com/css/#grid-media-queries), here preset seven dimensions: `xs` `sm` `md` `lg` `xl` `xxl` `xxxl`.
</docs>

<template>
  <a-row>
    <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
      Col
    </a-col>
    <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4">
      Col
    </a-col>
    <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
      Col
    </a-col>
  </a-row>
</template>
