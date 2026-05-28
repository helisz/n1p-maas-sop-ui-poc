<!-- [AI_START TIMESTAMP=2025-07-22 12:00:00] -->
<script setup lang="ts">
defineProps<{
  /** 顶部小卡片数量，默认 4 */
  statCards?: number;
  /** 底部表格卡片数量，默认 2 */
  tableCards?: number;
  /** 每张表格卡片内的行骨架数量，默认 5 */
  tableRows?: number;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部统计卡片骨架 -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card v-for="i in statCards ?? 4" :key="i">
        <CardHeader class="pb-2">
          <Skeleton class="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-8 w-16" />
        </CardContent>
      </Card>
    </div>
    <!-- 底部表格卡片骨架 -->
    <Card v-for="i in tableCards ?? 2" :key="i">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Skeleton class="h-6 w-32" />
          <Skeleton class="h-9 w-56" />
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-for="r in tableRows ?? 5" :key="r" class="flex items-center gap-4">
          <Skeleton class="h-4 flex-1" />
          <Skeleton class="h-4 flex-1" />
          <Skeleton class="h-4 flex-1" />
          <Skeleton class="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<!-- [AI_END LINES=43 TIMESTAMP=2025-07-22 12:00:00] -->
