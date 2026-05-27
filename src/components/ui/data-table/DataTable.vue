<!-- [AI_START TIMESTAMP=2025-07-21 09:30:00] -->
<script setup lang="ts">
import { computed, h, ref, watch, useSlots, onMounted } from 'vue';
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  FlexRender,
  type ColumnDef,
  type ColumnResizeMode,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  type RowSelectionState,
  type GroupingState,
  type ExpandedState,
  type ColumnPinningState,
  type RowPinningState,
} from '@tanstack/vue-table';

import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import { cn } from '@/lib/utils';

import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, EyeIcon } from '@heroicons/vue/24/outline';

export interface DataTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
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
  pageSizeOptions: () => [1, 10, 20, 50, 100],
  globalFilterPlaceholder: '搜索...',
});

const slots = useSlots();

// 内部状态
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const globalFilter = ref('');
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref<RowSelectionState>({});
const grouping = ref<GroupingState>([]);
const expanded = ref<ExpandedState>({});
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: props.pageSize,
});
const columnPinning = ref<ColumnPinningState>({ left: [], right: [] });
const rowPinning = ref<RowPinningState>({ top: [], bottom: [] });

watch(
  () => props.pageSize,
  (v) => {
    pagination.value.pageSize = v;
  },
);

// 自动插入选择列与展开列
const finalColumns = computed<ColumnDef<any, any>[]>(() => {
  const cols: ColumnDef<any, any>[] = [];

  if (props.enableRowSelection) {
    cols.push({
      id: 'select',
      header: ({ table }) =>
        h(Checkbox, {
          checked: table.getIsAllPageRowsSelected(),
          indeterminate: table.getIsSomePageRowsSelected(),
          'aria-label': '全选',
          'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          checked: row.getIsSelected(),
          'aria-label': '选择行',
          'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        }),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    });
  }

  if (props.enableExpanding) {
    cols.push({
      id: 'expander',
      header: () => null,
      cell: ({ row }) =>
        h(
          Button,
          {
            variant: 'ghost',
            size: 'sm',
            class: 'h-8 w-8 p-0',
            onClick: row.getToggleExpandedHandler(),
          },
          () => (row.getIsExpanded() ? h(ChevronUpIcon, { class: 'h-4 w-4' }) : h(ChevronDownIcon, { class: 'h-4 w-4' })),
        ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    });
  }

  cols.push(...props.columns);
  return cols;
});

// Table 选项（响应式）
const tableOptions = computed(() => ({
  data: props.data,
  columns: finalColumns.value,
  state: {
    sorting: sorting.value,
    columnFilters: columnFilters.value,
    globalFilter: globalFilter.value,
    columnVisibility: columnVisibility.value,
    rowSelection: rowSelection.value,
    grouping: grouping.value,
    expanded: expanded.value,
    pagination: pagination.value,
    columnPinning: columnPinning.value,
    rowPinning: rowPinning.value,
  },
  onSortingChange: (updater: any) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
  },
  onColumnFiltersChange: (updater: any) => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater;
  },
  onGlobalFilterChange: (updater: any) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater;
  },
  onColumnVisibilityChange: (updater: any) => {
    columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater;
  },
  onRowSelectionChange: (updater: any) => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater;
  },
  onGroupingChange: (updater: any) => {
    grouping.value = typeof updater === 'function' ? updater(grouping.value) : updater;
  },
  onExpandedChange: (updater: any) => {
    expanded.value = typeof updater === 'function' ? updater(expanded.value) : updater;
  },
  onPaginationChange: (updater: any) => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater;
  },
  onColumnPinningChange: (updater: any) => {
    columnPinning.value = typeof updater === 'function' ? updater(columnPinning.value) : updater;
  },
  onRowPinningChange: (updater: any) => {
    rowPinning.value = typeof updater === 'function' ? updater(rowPinning.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: props.enableSorting ? getSortedRowModel() : undefined,
  getFilteredRowModel: props.enableGlobalFilter || props.enableColumnFilters ? getFilteredRowModel() : undefined,
  getPaginationRowModel: props.enablePagination ? getPaginationRowModel() : undefined,
  getGroupedRowModel: props.enableGrouping ? getGroupedRowModel() : undefined,
  getExpandedRowModel: props.enableExpanding ? getExpandedRowModel() : undefined,
  enableColumnResizing: props.enableColumnResizing,
  defaultColumn: { size: 80, minSize: 20 },
  columnResizeMode: 'onChange' as ColumnResizeMode,
  enableRowPinning: props.enableRowPinning,
  enableMultiRowSelection: props.enableRowSelection,
}));

// 使用 computed 包裹 table 实例，确保响应式状态变化时自动重建 table
const table = computed(() => useVueTable(tableOptions.value));

// 分页跳转
const jumpPage = ref('1');
watch(
  () => table.value.getState().pagination.pageIndex,
  (idx) => {
    jumpPage.value = String(idx + 1);
  },
);

function handleJump() {
  const page = Number(jumpPage.value);
  if (!Number.isNaN(page) && page >= 1 && page <= table.value.getPageCount()) {
    table.value.setPageIndex(page - 1);
  }
}

function handlePageSizeChange(sizeStr: any) {
  const size = Number(sizeStr);
  table.value.setPageSize(size);
}

function handleResizeStart(header: any, event: MouseEvent | TouchEvent) {
  const handler = header.getResizeHandler?.();
  if (typeof handler === 'function') {
    handler(event as any);
  }
}

// 自动根据列 meta 初始化固定列
watch(
  () => finalColumns.value,
  (cols) => {
    if (!props.enableColumnPinning) return;
    const left: string[] = [];
    const right: string[] = [];
    cols.forEach((col: any) => {
      const pinned = col.meta?.pinned;
      if (pinned === 'left' && col.id) left.push(col.id);
      if (pinned === 'right' && col.id) right.push(col.id);
    });
    columnPinning.value = { left, right };
  },
  { immediate: true },
);

// 列固定样式
function getPinningClass(column: any) {
  const pinned = column.getIsPinned?.() as 'left' | 'right' | false;
  if (!pinned) return '';
  const base = 'sticky z-30 bg-background';
  if (pinned === 'left') {
    return `${base} left-0 after:content-[''] after:absolute after:top-0 after:right-0 after:h-full after:w-px after:shadow-[2px_0_4px_rgba(0,0,0,0.1)]`;
  }
  if (pinned === 'right') {
    return `${base} right-0 before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-px before:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]`;
  }
  return '';
}

// 行固定样式
function getRowPinningClass(row: any) {
  const pinned = row.getIsPinned?.() as 'top' | 'bottom' | false;
  if (!pinned) return '';
  return 'sticky z-20 bg-background';
}

// 列大小调整
function getResizingClass(column: any) {
  return column.getIsResizing?.() ? 'opacity-50' : '';
}
</script>

<template>
  <div :class="cn('space-y-4', props.class)">
    <!-- 工具栏：全局搜索  -->
    <div v-if="enableGlobalFilter" class="flex items-center justify-between gap-4">
      <div class="flex flex-1 items-center gap-2">
        <Input v-if="enableGlobalFilter" v-model="globalFilter" :placeholder="globalFilterPlaceholder" class="max-w-sm" />
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="relative w-full">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="cn('relative', getPinningClass(header.column), getResizingClass(header.column), props.enableSorting && header.column.getCanSort() ? 'cursor-pointer select-none' : '')"
              :style="{
                width: header.getSize() + 'px',
                minWidth: header.getSize() + 'px',
              }"
              @click="props.enableSorting && header.column.getCanSort() ? header.column.toggleSorting() : undefined"
            >
              <slot v-if="slots[`header-${header.column.id}`]" :name="`header-${header.column.id}`" v-bind="header.getContext()" />
              <template v-else>
                <div class="flex items-center gap-1">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
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
        <TableBody v-if="props.enableRowPinning">
          <TableRow v-for="row in table.getTopRows()" :key="row.id" :data-state="row.getIsSelected() && 'selected'" :class="cn(getRowPinningClass(row), 'top-0 border-b-2')">
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="cn(getPinningClass(cell.column), getResizingClass(cell.column))"
              :style="{
                width: cell.column.getSize() + 'px',
                minWidth: cell.column.getSize() + 'px',
              }"
            >
              <slot v-if="slots[`cell-${cell.column.id}`]" :name="`cell-${cell.column.id}`" v-bind="cell.getContext()" />
              <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </TableBody>

        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'" :class="cn(row.getIsSelected() ? 'bg-muted' : '', getRowPinningClass(row))">
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="cn(getPinningClass(cell.column), getResizingClass(cell.column))"
                :style="{
                  width: cell.column.getSize() + 'px',
                  minWidth: cell.column.getSize() + 'px',
                }"
              >
                <slot v-if="slots[`cell-${cell.column.id}`]" :name="`cell-${cell.column.id}`" v-bind="cell.getContext()" />
                <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="finalColumns.length" class="h-24 text-center">
              <TableEmpty>暂无数据</TableEmpty>
            </TableCell>
          </TableRow>
        </TableBody>

        <!-- 行固定：底部行 -->
        <TableBody v-if="props.enableRowPinning">
          <TableRow v-for="row in table.getBottomRows()" :key="row.id" :data-state="row.getIsSelected() && 'selected'" :class="cn(getRowPinningClass(row), 'bottom-0 border-t-2')">
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="cn(getPinningClass(cell.column), getResizingClass(cell.column))"
              :style="{
                width: cell.column.getSize() + 'px',
                minWidth: cell.column.getSize() + 'px',
              }"
            >
              <slot v-if="slots[`cell-${cell.column.id}`]" :name="`cell-${cell.column.id}`" v-bind="cell.getContext()" />
              <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 分页 -->
    <div v-if="enablePagination" class="flex items-center justify-between px-2">
      <div class="flex items-center space-x-2">
        <div class="text-muted-foreground text-sm">共 {{ table.getFilteredRowModel().rows.length }} 条</div>

        <div class="flex items-center gap-1 text-sm">
          <span class="text-muted-foreground text-sm">每页</span>
          <Select :model-value="String(table.getState().pagination.pageSize)" @update:model-value="handlePageSizeChange">
            <SelectTrigger class="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">{{ size }}</SelectItem>
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
<!-- [AI_END LINES=435 TIMESTAMP=2025-07-21 09:00:00] -->
