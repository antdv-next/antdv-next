<docs lang="zh-CN">
嵌套在弹框当中使用。
</docs>

<docs lang="en-US">
Nested in the modal.
</docs>

<script setup lang="ts">
import { ref } from 'vue';

const show1 = ref(false);
const show2 = ref(false);
const show3 = ref(false);

const handlePreviewGroupChange = (current: number, prev: number) => {
  console.log(`current index: ${current}, prev index: ${prev}`);
};
</script>

<template>
  <a-button @click="show1 = true">
    showModal
  </a-button>
  <a-modal
    v-model:open="show1"
    @cancel="show1 = false"
    @ok="show1 = false"
  >
    <a-button @click="show2 = true">
      test2
    </a-button>
    <a-modal
      v-model:open="show2"
      @cancel="show2 = false"
      @ok="show2 = false"
    >
      <a-button @click="show3 = true">
        test3
      </a-button>
      <a-modal
        v-model:open="show3"
        @cancel="show3 = false"
        @ok="show3 = false"
      >
        <a-image
          :width="200"
          alt="svg image"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <a-divider />
        <a-image-preview-group
          :preview="{
            onChange: handlePreviewGroupChange,
          }"
        >
          <a-image
            :width="200"
            alt="svg image"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <a-image
            :width="200"
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </a-image-preview-group>
      </a-modal>
    </a-modal>
  </a-modal>
</template>
