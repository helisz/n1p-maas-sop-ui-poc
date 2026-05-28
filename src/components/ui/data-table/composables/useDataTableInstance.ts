// [AI_START TIMESTAMP=2025-07-21 16:45:00]
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type ColumnResizeMode,
  type Table,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type GroupingState,
  type ExpandedState,
  type PaginationState,
  type ColumnPinningState,
  type RowPinningState,
} from '@tanstack/vue-table';

export interface DataTableTableOptions {
  /** 数据源：支持静态数组、Ref 或 ComputedRef（fetch 模式传入 ComputedRef） */
  data: any[] | Ref<any[]> | ComputedRef<any[]>;
  columns: ComputedRef<ColumnDef<any, any>[]>;
  sorting: Ref<SortingState>;
  columnFilters: Ref<ColumnFiltersState>;
  globalFilter: Ref<string>;
  columnVisibility: Ref<VisibilityState>;
  rowSelection: Ref<RowSelectionState>;
  grouping: Ref<GroupingState>;
  expanded: Ref<ExpandedState>;
  pagination: Ref<PaginationState>;
  columnPinning: Ref<ColumnPinningState>;
  rowPinning: Ref<RowPinningState>;
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
  /** fetch 模式开关（由 DataTable.vue 根据是否传入 fetch 自动设置） */
  fetchMode?: boolean;
  /** fetch 模式下的服务端总页数 */
  fetchPageCount?: Ref<number> | ComputedRef<number>;
}

/**
 * 处理状态更新器函数或值
 */
function resolveUpdater<T>(updater: T | ((prev: T) => T), current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

/**
 * 创建和管理 TanStack Table 实例
 */
export function useDataTableInstance(options: DataTableTableOptions): ComputedRef<Table<any>> {
  const {
    data,
    columns,
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
    enableSorting = false,
    enableGlobalFilter = false,
    enableColumnFilters = false,
    enablePagination = true,
    enableColumnResizing = false,
    enableColumnPinning = true,
    enableGrouping = false,
    enableExpanding = false,
    enableRowSelection = false,
    enableRowPinning = true,
  } = options;

  const isFetch = options.fetchMode === true;

  const tableOptions = computed(() => ({
    data: unref(data),
    columns: columns.value,
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
      sorting.value = resolveUpdater(updater, sorting.value);
    },
    onColumnFiltersChange: (updater: any) => {
      columnFilters.value = resolveUpdater(updater, columnFilters.value);
    },
    onGlobalFilterChange: (updater: any) => {
      globalFilter.value = resolveUpdater(updater, globalFilter.value);
    },
    onColumnVisibilityChange: (updater: any) => {
      columnVisibility.value = resolveUpdater(updater, columnVisibility.value);
    },
    onRowSelectionChange: (updater: any) => {
      rowSelection.value = resolveUpdater(updater, rowSelection.value);
    },
    onGroupingChange: (updater: any) => {
      grouping.value = resolveUpdater(updater, grouping.value);
    },
    onExpandedChange: (updater: any) => {
      expanded.value = resolveUpdater(updater, expanded.value);
    },
    onPaginationChange: (updater: any) => {
      pagination.value = resolveUpdater(updater, pagination.value);
    },
    onColumnPinningChange: (updater: any) => {
      columnPinning.value = resolveUpdater(updater, columnPinning.value);
    },
    onRowPinningChange: (updater: any) => {
      rowPinning.value = resolveUpdater(updater, rowPinning.value);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting && !isFetch ? getSortedRowModel() : undefined,
    getFilteredRowModel: (enableGlobalFilter || enableColumnFilters) && !isFetch ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination && !isFetch ? getPaginationRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    manualPagination: isFetch,
    manualSorting: isFetch,
    manualFiltering: isFetch,
    pageCount: options.fetchPageCount ? unref(options.fetchPageCount) : undefined,
    enableColumnResizing,
    defaultColumn: { size: 80, minSize: 20 },
    columnResizeMode: 'onChange' as ColumnResizeMode,
    enableRowPinning,
    enableMultiRowSelection: enableRowSelection,
  }));

  return computed(() => useVueTable(tableOptions.value));
}

/**
 * 初始化列固定配置（根据列的 meta.pinned）
 */
export function useDataTableColumnPinning(finalColumns: ComputedRef<ColumnDef<any, any>[]>, columnPinning: Ref<ColumnPinningState>, enableColumnPinning: boolean): void {
  watch(
    () => finalColumns.value,
    (cols) => {
      if (!enableColumnPinning) return;

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
}
