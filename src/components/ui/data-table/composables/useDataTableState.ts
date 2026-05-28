import { ref, watch, type Ref } from 'vue';
import type { SortingState, ColumnFiltersState, VisibilityState, PaginationState, RowSelectionState, GroupingState, ExpandedState, ColumnPinningState, RowPinningState } from '@tanstack/vue-table';

export interface DataTableStateOptions {
  pageSize?: number;
}

/**
 * 管理 DataTable 所有响应式状态
 */
export function useDataTableState(options: DataTableStateOptions = {}) {
  const { pageSize = 10 } = options;

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const globalFilter = ref('');
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref<RowSelectionState>({});
  const grouping = ref<GroupingState>([]);
  const expanded = ref<ExpandedState>({});
  const pagination = ref<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const columnPinning = ref<ColumnPinningState>({ left: [], right: [] });
  const rowPinning = ref<RowPinningState>({ top: [], bottom: [] });

  /**
   * 同步分页大小变化
   */
  const syncPageSize = (newPageSize: number) => {
    pagination.value.pageSize = newPageSize;
  };

  /**
   * 重置所有状态
   */
  const resetState = () => {
    sorting.value = [];
    columnFilters.value = [];
    globalFilter.value = '';
    columnVisibility.value = {};
    rowSelection.value = {};
    grouping.value = [];
    expanded.value = {};
    pagination.value = { pageIndex: 0, pageSize };
    columnPinning.value = { left: [], right: [] };
    rowPinning.value = { top: [], bottom: [] };
  };

  return {
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
    syncPageSize,
    resetState,
  };
}
