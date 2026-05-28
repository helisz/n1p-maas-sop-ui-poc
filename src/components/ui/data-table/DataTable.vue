<!-- [AI_START TIMESTAMP=2025-07-21 09:30:00] -->
<!--
  ============ DataTable 组件说明 ============
  
  支持双模式：
  1. Data 模式（纯受控）：传入 :data 数组，前台处理分页/排序/过滤
  2. Fetch 模式（非受控）：传入 :fetch 函数，组件接管请求生命周期，
     自动在分页/排序/筛选变化时重新请求，并通过 expose 暴露 reload() 方法
  
  Composables 结构：
  - useDataTableState.ts    - 管理所有表格状态
  - useDataTableColumns.ts  - 处理列逻辑（自动插入选择/展开列）
  - useDataTableStyles.ts   - 样式计算（缓存优化）
  - useDataTableHandlers.ts - 事件处理
  - useDataTableInstance.ts - Table 实例管理
  - useDataTableFetch.ts    - Fetch 模式：异步数据获取与生命周期管理
-->
<script setup lang="ts">
import { FlexRender, type ColumnDef, type Column, type Row } from '@tanstack/vue-table';

import { cn } from '@/lib/utils';

import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, InboxIcon } from '@heroicons/vue/24/outline';

import { useDataTableState, useDataTableColumns, useDataTableStyles, useDataTableHandlers, useDataTableInstance, useDataTableColumnPinning, useDataTableFetch, type FetchFn } from './composables';

export interface DataTableProps {
  columns: ColumnDef<any, any>[];
  /** Data 模式：传入静态数组，前台处理分页（与 fetch 二选一） */
  data?: any[];
  /** Fetch 模式：传入异步函数，组件接管请求生命周期（与 data 二选一） */
  fetch?: FetchFn;
  /** Fetch 模式：透传给 fetch 的额外参数，变化时自动重新请求 */
  fetchParams?: Record<string, any>;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enablePagination?: boolean;
  enableColumnResizing?: boolean;
  enableColumnPinning?: boolean;
  enableGrouping?: boolean;
  enableExpanding?: boolean;
  enableRowSelection?: boolean;
  enableRowPinning?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  globalFilterPlaceholder?: string;
  class?: string;
}

const props = withDefaults(defineProps<DataTableProps>(), {
  data: () => [],
  enableSorting: false,
  enableGlobalFilter: false,
  enableColumnFilters: false,
  enablePagination: true,
  enableColumnResizing: false,
  enableColumnPinning: true,
  enableGrouping: false,
  enableExpanding: false,
  enableRowSelection: false,
  enableRowPinning: true,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  globalFilterPlaceholder: '搜索...',
});

const slots = useSlots();

// ============ 模式判断 ============
const isFetchMode = computed(() => typeof props.fetch === 'function');

// ============ Composables 组合 ============

// 1. 表格状态管理
const { sorting, columnFilters, globalFilter, columnVisibility, rowSelection, grouping, expanded, pagination, columnPinning, rowPinning, syncPageSize } = useDataTableState({ pageSize: props.pageSize });

// 2. 列管理
const finalColumns = useDataTableColumns(
  computed(() => props.columns),
  {
    enableRowSelection: props.enableRowSelection,
    enableExpanding: props.enableExpanding,
  },
);

// 3. 样式计算
const { getPinningClass, getRowPinningClass, getResizingClass } = useDataTableStyles();

// 4. Fetch 模式（仅当传入 fetch 时激活）
const fetchState = props.fetch
  ? useDataTableFetch({
      fetch: props.fetch,
      pagination,
      sorting,
      columnFilters,
      globalFilter,
      extraParams: computed(() => props.fetchParams ?? {}),
    })
  : null;

// 5. 统一数据源（data 模式 vs fetch 模式）
const resolvedData = computed(() => {
  if (isFetchMode.value && fetchState) {
    return fetchState.dataSource.value;
  }
  return props.data ?? [];
});

// 6. Fetch 模式下的服务端总页数
const fetchPageCount = computed(() => {
  if (fetchState) {
    return Math.ceil(fetchState.remoteTotal.value / pagination.value.pageSize) || 1;
  }
  return 1;
});

// 7. 表格实例创建
const table = useDataTableInstance({
  data: resolvedData,
  columns: finalColumns,
  sorting,
  columnFilters,
  globalFilter,
  columnVisibility,
  rowSelection,
  grouping,
  expanded,
  pagination,
  columnPinning,
  rowPinning,
  enableSorting: props.enableSorting,
  enableGlobalFilter: props.enableGlobalFilter,
  enableColumnFilters: props.enableColumnFilters,
  enablePagination: props.enablePagination,
  enableColumnResizing: props.enableColumnResizing,
  enableColumnPinning: props.enableColumnPinning,
  enableGrouping: props.enableGrouping,
  enableExpanding: props.enableExpanding,
  enableRowSelection: props.enableRowSelection,
  enableRowPinning: props.enableRowPinning,
  fetchMode: isFetchMode.value,
  fetchPageCount,
});

// 8. 初始化列固定
useDataTableColumnPinning(finalColumns, columnPinning, props.enableColumnPinning);

// 9. 事件处理
const { jumpPage, handleJump, handlePageSizeChange, handleResizeStart } = useDataTableHandlers(table);

// ============ 显示计算属性 ============

const fetchLoading = computed(() => fetchState?.loading.value ?? false);

const totalRowCount = computed(() => {
  if (isFetchMode.value && fetchState) {
    return fetchState.remoteTotal.value;
  }
  return table.value.getFilteredRowModel().rows.length;
});

// ============ Props 变化监听 ============

// 监听分页大小变化
watch(
  () => props.pageSize,
  (newSize) => syncPageSize(newSize),
);

// ============ 暴露 API ============

defineExpose({
  /** 手动刷新表格数据（Fetch 模式下可用） */
  reload: fetchState?.reload ?? (() => Promise.resolve()),
});
</script>

<template>
  <div :class="cn('space-y-4', props.class)">
    <!-- 工具栏：全局搜索 -->
    <div v-if="props.enableGlobalFilter" class="flex items-center justify-between gap-4">
      <Input v-model="globalFilter" :placeholder="props.globalFilterPlaceholder" class="max-w-sm" />
    </div>

    <!-- 表格容器 -->
    <div class="relative w-full overflow-auto">
      <!-- [AI_START TIMESTAMP=2025-07-22 10:00:00]
          Fetch 模式加载中遮罩 -->
      <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="fetchLoading" class="bg-background/80 absolute inset-0 z-40 flex items-center justify-center rounded-md backdrop-blur-[2px]">
          <div class="flex flex-col items-center gap-3">
            <Spinner class="text-primary h-5 w-5 animate-spin" />
            <span class="text-muted-foreground text-sm">加载中...</span>
          </div>
        </div>
      </Transition>
      <!-- [AI_END LINES=15 TIMESTAMP=2025-07-22 10:00:00] -->
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="cn('relative', getPinningClass(header.column), getResizingClass(header.column), props.enableSorting && header.column.getCanSort() ? 'cursor-pointer select-none' : '')"
              :style="{
                width: `${header.getSize()}px`,
                minWidth: `${header.getSize()}px`,
              }"
              @click="props.enableSorting && header.column.getCanSort() && header.column.toggleSorting()"
            >
              <slot v-if="slots[`header-${header.column.id}`]" :name="`header-${header.column.id}`" v-bind="header.getContext()" />
              <template v-else>
                <div class="flex items-center gap-1">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <!-- 排序指示器 -->
                  <template v-if="props.enableSorting && header.column.getCanSort()">
                    <ArrowsUpDownIcon v-if="!header.column.getIsSorted()" class="text-muted-foreground h-3.5 w-3.5" />
                    <ArrowUpIcon v-else-if="header.column.getIsSorted() === 'asc'" class="h-3.5 w-3.5" />
                    <ArrowDownIcon v-else class="h-3.5 w-3.5" />
                  </template>
                </div>
                <!-- 列过滤输入框 -->
                <div v-if="props.enableColumnFilters && header.column.getCanFilter()" class="mt-1">
                  <Input :model-value="String(header.column.getFilterValue() ?? '')" type="text" placeholder="过滤..." class="h-7 w-full text-xs" @update:model-value="(v) => header.column.setFilterValue(v)" />
                </div>
                <!-- 列大小调整手柄 -->
                <div v-if="props.enableColumnResizing && header.column.getCanResize()" class="absolute top-[25%] right-0 z-20 h-[50%] w-px cursor-col-resize" @mousedown="handleResizeStart(header, $event)" @touchstart="handleResizeStart(header, $event)">
                  <div :class="header.column.getIsResizing() ? 'bg-primary' : 'bg-border'" class="mx-auto h-full w-px" />
                </div>
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>

        <!-- 行固定：顶部行 -->
        <TableBody v-if="props.enableRowPinning && table.getTopRows?.().length">
          <DataTableRow v-for="row in table.getTopRows?.()" :key="row.id" :row="row" :slots="slots" :final-columns="finalColumns" :get-pinning-class="getPinningClass" :get-resizing-class="getResizingClass" :row-pinning-class="`${getRowPinningClass(row)} top-0 border-b-2`" />
        </TableBody>

        <!-- 普通行 -->
        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <DataTableRow v-for="row in table.getRowModel().rows" :key="row.id" :row="row" :slots="slots" :final-columns="finalColumns" :get-pinning-class="getPinningClass" :get-resizing-class="getResizingClass" :is-selected="row.getIsSelected()" :row-pinning-class="getRowPinningClass(row)" />
          </template>
          <!-- [AI_START TIMESTAMP=2025-07-22 10:00:00]
               暂无数据 -->
          <TableRow v-else>
            <TableCell :colspan="finalColumns.length" class="h-48 text-center">
              <div class="flex flex-col items-center justify-center gap-3">
                <InboxIcon class="text-muted-foreground/30 h-10 w-10" />
                <span class="text-muted-foreground text-sm">暂无数据</span>
              </div>
            </TableCell>
          </TableRow>
          <!-- [AI_END LINES=10 TIMESTAMP=2025-07-22 10:00:00] -->
        </TableBody>

        <!-- 行固定：底部行 -->
        <TableBody v-if="props.enableRowPinning && table.getBottomRows?.().length">
          <DataTableRow v-for="row in table.getBottomRows?.()" :key="row.id" :row="row" :slots="slots" :final-columns="finalColumns" :get-pinning-class="getPinningClass" :get-resizing-class="getResizingClass" :row-pinning-class="`${getRowPinningClass(row)} bottom-0 border-t-2`" />
        </TableBody>
      </Table>
    </div>

    <!-- 分页 -->
    <div v-if="props.enablePagination" class="flex items-center justify-between px-2">
      <div class="flex items-center space-x-2">
        <div class="text-muted-foreground text-sm">共 {{ totalRowCount }} 条</div>

        <div class="flex items-center gap-1 text-sm">
          <span class="text-muted-foreground text-sm">每页</span>
          <Select :model-value="String(table.getState().pagination.pageSize)" @update:model-value="handlePageSizeChange">
            <SelectTrigger class="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in props.pageSizeOptions" :key="size" :value="String(size)">{{ size }}</SelectItem>
            </SelectContent>
          </Select>
          <span class="text-muted-foreground text-sm">条</span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          <ChevronLeftIcon class="h-4 w-4" />
          上一页
        </Button>

        <div class="flex items-center gap-1 text-sm">
          <span class="text-muted-foreground text-sm">第</span>
          <Input v-model="jumpPage" type="number" min="1" :max="table.getPageCount() || 1" class="h-8 w-14 text-center" @keyup.enter="handleJump" @blur="handleJump" />
          <span class="text-muted-foreground text-sm">/ {{ table.getPageCount() }} 页</span>
        </div>

        <Button variant="outline" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          下一页
          <ChevronRightIcon class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
<!-- [AI_END LINES=490 TIMESTAMP=2025-07-21 17:00:00] -->
