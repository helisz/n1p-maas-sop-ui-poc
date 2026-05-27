<script setup lang="ts">
// Explicitly import layout components to resolve dynamic string names accurately
import PortalLayout from '@/layouts/PortalLayout.vue';

// Map layout string identifiers to their respective Vue component instances
const layouts: Record<string, any> = {
  PortalLayout,
};

const route = useRoute();

// Compute the current layout active for the active route destination
const currentLayout = computed(() => {
  const layoutName = route.meta.layout as string;
  return layouts[layoutName] || 'div';
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- Render the dynamically computed layout framework container -->
    <component :is="currentLayout">
      <!-- Inject the active view route target template natively -->
      <component :is="Component" />
    </component>
  </router-view>
</template>
