<template>
  <div v-if="showFrame">
    <template v-for="frame in getFramePages" :key="frame.path">
      <frame-content
        v-if="hasRenderFrame(frame.name as string)"
        v-show="showIframe(frame)"
        :frame-src="frame.meta?.frameSrc"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, unref } from 'vue';

import FrameContent from '../components/FrameContent.vue';
import { useFrameKeepAlive } from './useFrameKeepAlive';

const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();

const showFrame = computed(() => unref(getFramePages).length > 0);
</script>
