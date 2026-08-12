<docs lang="zh-CN">
通过 `showProgress` 在回到顶部按钮边缘展示当前滚动进度。
</docs>

<docs lang="en-US">
Use `showProgress` to display the current scroll progress around the BackTop button edge.
</docs>

<template>
  <div class="h-300vh p-10px">
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <a-float-back-top show-progress :visibility-height="0" :style="{ insetInlineEnd: '24px' }" shape="circle" />
    <a-float-back-top show-progress :visibility-height="0" :style="{ insetInlineEnd: '88px' }" shape="square" />
  </div>
</template>
