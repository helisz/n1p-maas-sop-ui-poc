<!-- [AI_START TIMESTAMP=2025-06-20 08:30:00] -->
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { ClassValue } from 'clsx'

const props = defineProps<{ class?: ClassValue }>()
const classes = computed(() => cn('rounded-lg border border-border bg-card text-card-foreground shadow-card transition-shadow duration-200 hover:shadow-card-hover', props.class))
</script>

<template>
  <div :class="classes"><slot /></div>
</template>
<!-- [AI_END LINES=11 TIMESTAMP=2025-06-20 08:30:00] -->
