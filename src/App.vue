<template>
  <t-config-provider :global-config="globalConfig">
    <router-view :class="[mode]" />
  </t-config-provider>
</template>
<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next';
import zhCN from 'tdesign-vue-next/es/locale/zh_CN';
import { computed } from 'vue';

import { useSettingStore } from '@/store';

const globalConfig = zhCN as unknown as GlobalConfigProvider;

const store = useSettingStore();

const mode = computed(() => {
  return store.displayMode;
});
</script>
<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
