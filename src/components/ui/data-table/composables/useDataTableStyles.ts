import { type Column, type Row } from '@tanstack/vue-table';

/**
 * 处理表格样式计算，包含缓存优化
 */
export function useDataTableStyles() {
  const pinningClassCache = new Map<string, string>();

  /**
   * 获取列固定样式（左侧或右侧固定）
   * 使用 Map 缓存避免重复创建样式字符串
   */
  function getPinningClass(column: Column<any, any>): string {
    const pinned = column.getIsPinned?.() as 'left' | 'right' | false;
    if (!pinned) return '';

    const cacheKey = `${column.id}-${pinned}`;
    if (pinningClassCache.has(cacheKey)) {
      return pinningClassCache.get(cacheKey)!;
    }

    const base = 'sticky z-30 bg-background';
    let className = '';

    if (pinned === 'left') {
      className = `${base} left-0 after:content-[''] after:absolute after:top-0 after:right-0 after:h-full after:w-px after:shadow-[2px_0_4px_rgba(0,0,0,0.1)]`;
    } else if (pinned === 'right') {
      className = `${base} right-0 before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-px before:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]`;
    }

    pinningClassCache.set(cacheKey, className);
    return className;
  }

  /**
   * 获取行固定样式（顶部或底部固定）
   */
  function getRowPinningClass(row: Row<any>): string {
    const pinned = row.getIsPinned?.() as 'top' | 'bottom' | false;
    return pinned ? 'sticky z-20 bg-background' : '';
  }

  /**
   * 获取列大小调整时的样式
   */
  function getResizingClass(column: Column<any, any>): string {
    return column.getIsResizing?.() ? 'opacity-50' : '';
  }

  /**
   * 清空样式缓存
   */
  function clearCache(): void {
    pinningClassCache.clear();
  }

  return {
    getPinningClass,
    getRowPinningClass,
    getResizingClass,
    clearCache,
  };
}
