// [AI_START TIMESTAMP=2025-07-21 16:30:00]
import type { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/vue-table';

/**
 * fetch 函数接收的参数
 */
export interface FetchParams {
  /** 当前页码（1-based） */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 排序状态 */
  sorting: SortingState;
  /** 列过滤状态 */
  filters: ColumnFiltersState;
  /** 全局过滤关键词 */
  globalFilter: string;
  /** 额外参数透传 */
  [key: string]: any;
}

/**
 * fetch 函数返回的结果（与全局 PageResult<T> 结构统一）
 */
export interface FetchResult {
  /** 数据总条数 */
  total: number;
  /** 每页条数 */
  size: number;
  /** 当前页码 */
  current: number;
  /** 总页数 */
  pages: number;
  /** 当前页数据 */
  records: any[];
}

/**
 * fetch 函数类型签名
 */
export type FetchFn = (params: FetchParams) => Promise<FetchResult>;

export interface DataTableFetchOptions {
  /** fetch 请求函数 */
  fetch: FetchFn;
  /** 分页状态 */
  pagination: Ref<PaginationState>;
  /** 排序状态（可选） */
  sorting?: Ref<SortingState>;
  /** 列过滤状态（可选） */
  columnFilters?: Ref<ColumnFiltersState>;
  /** 全局过滤状态（可选） */
  globalFilter?: Ref<string>;
  /** 额外参数（可选，变化时自动重新请求） */
  extraParams?: Ref<Record<string, any>>;
  /** 是否在挂载时立即请求，默认 true */
  immediate?: boolean;
}

/**
 * 管理异步数据获取的生命周期
 *
 * 职责：
 * - 维护 loading / dataSource / remoteTotal 状态
 * - 深度监听分页、排序、筛选变化，自动重新请求
 * - 提供防竞态的 reload 方法供父组件手动刷新
 */
export function useDataTableFetch(options: DataTableFetchOptions) {
  const { fetch: fetchFn, pagination, sorting, columnFilters, globalFilter, extraParams, immediate = true } = options;

  const loading = ref(false);
  const dataSource = ref<any[]>([]);
  const remoteTotal = ref(0);

  // 防竞态 ID：确保只有最新一次请求的结果会被应用
  let fetchId = 0;

  /**
   * 发起数据请求
   *
   * 可由以下途径触发：
   * 1. 组件 onMounted 初始化
   * 2. 分页 / 排序 / 筛选状态变化（watch 自动触发）
   * 3. 父组件通过 ref 手动调用 reload()
   */
  async function reload(): Promise<void> {
    const currentId = ++fetchId;
    loading.value = true;

    try {
      const params: FetchParams = {
        page: pagination.value.pageIndex + 1,
        pageSize: pagination.value.pageSize,
        sorting: sorting?.value ?? [],
        filters: columnFilters?.value ?? [],
        globalFilter: globalFilter?.value ?? '',
        ...unref(extraParams),
      };

      const result = await fetchFn(params);

      // 仅应用最新请求的结果，丢弃过期响应
      if (currentId === fetchId) {
        dataSource.value = result.records;
        remoteTotal.value = result.total;
      }
    } catch {
      if (currentId === fetchId) {
        dataSource.value = [];
        remoteTotal.value = 0;
      }
    } finally {
      if (currentId === fetchId) {
        loading.value = false;
      }
    }
  }

  // 收集需要监听的响应式源
  const watchers: Array<Ref<any>> = [pagination];
  if (sorting) watchers.push(sorting);
  if (columnFilters) watchers.push(columnFilters);
  if (globalFilter) watchers.push(globalFilter);
  if (extraParams) watchers.push(extraParams);

  // 深度监听：分页/排序/筛选变化时自动重新请求
  watch(watchers, () => reload(), { deep: true });

  // 初始请求：组件挂载后执行
  if (immediate) {
    onMounted(() => reload());
  }

  return {
    /** 是否正在加载 */
    loading,
    /** 当前页数据 */
    dataSource,
    /** 服务端数据总条数 */
    remoteTotal,
    /** 手动刷新方法 */
    reload,
  };
}
// [AI_END LINES=128 TIMESTAMP=2025-07-21 16:30:00]
