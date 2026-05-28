import type { Table } from '@tanstack/vue-table';

export interface DataTableHandlersOptions {
  initialPageIndex?: number;
}

/**
 * 处理数据表的用户交互和事件
 */
export function useDataTableHandlers(table: ComputedRef<Table<any>>, options: DataTableHandlersOptions = {}) {
  const { initialPageIndex = 0 } = options;

  // 分页跳转输入框状态
  const jumpPage = ref(String(initialPageIndex + 1));

  /**
   * 监听分页索引变化，更新跳转输入框
   */
  watch(
    () => table.value.getState().pagination.pageIndex,
    (idx) => {
      jumpPage.value = String(idx + 1);
    },
  );

  /**
   * 处理跳转到指定页
   */
  function handleJump(): void {
    const page = Number(jumpPage.value);
    const pageCount = table.value.getPageCount();

    if (!Number.isNaN(page) && page >= 1 && page <= pageCount) {
      table.value.setPageIndex(page - 1);
    }
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(sizeStr: unknown): void {
    const size = Number(sizeStr);
    if (!Number.isNaN(size) && size > 0) {
      table.value.setPageSize(size);
    }
  }

  /**
   * 处理列大小调整开始
   */
  function handleResizeStart(header: any, event: MouseEvent | TouchEvent): void {
    const handler = header.getResizeHandler?.();
    if (typeof handler === 'function') {
      handler(event as any);
    }
  }

  return {
    jumpPage,
    handleJump,
    handlePageSizeChange,
    handleResizeStart,
  };
}
