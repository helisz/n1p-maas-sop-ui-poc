<!-- [AI_START TIMESTAMP=2025-07-22 10:30:00] -->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <ArrowPathIcon role="status" aria-label="Loading" :class="cn('h-4 w-4 animate-spin', props.class)" />
</template>
<!-- [AI_END LINES=18 TIMESTAMP=2025-07-22 10:30:00] -->
