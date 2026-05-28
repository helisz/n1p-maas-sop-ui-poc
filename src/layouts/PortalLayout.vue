<!-- [AI_START TIMESTAMP=2025-06-15 12:00:00] -->
<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// [AI_START TIMESTAMP=2025-06-17 10:15:00]
watch(
  () => [auth.isLoading, auth.isLoggedIn],
  ([loading, loggedIn]) => {
    if (!loading && !loggedIn) {
      router.replace('/');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="auth.isLoading || !auth.isLoggedIn" class="bg-background flex h-screen items-center justify-center">
    <ArrowPathIcon class="text-muted-foreground h-6 w-6 animate-spin" />
  </div>
  <div v-else class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Header />
      <!-- [AI_START TIMESTAMP=2025-07-22 11:00:00] -->
      <main class="bg-muted/30 flex-1 overflow-y-auto p-6">
        <Suspense :timeout="0">
          <template #default>
            <div :key="route.fullPath">
              <slot />
            </div>
          </template>
          <template #fallback>
            <PageSkeleton />
          </template>
        </Suspense>
      </main>
      <!-- [AI_END LINES=12 TIMESTAMP=2025-07-22 11:00:00] -->
    </div>
  </div>
</template>
<!-- [AI_END LINES=36 TIMESTAMP=2025-06-15 12:00:00] -->
