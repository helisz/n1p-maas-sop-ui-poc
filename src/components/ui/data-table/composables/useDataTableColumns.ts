import { computed, h, type ComputedRef } from 'vue';
import { type ColumnDef } from '@tanstack/vue-table';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Button from '@/components/ui/Button.vue';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';

export interface DataTableColumnsOptions {
  enableRowSelection?: boolean;
  enableExpanding?: boolean;
}

/**
 * 处理列相关逻辑，自动插入选择列和展开列
 */
export function useDataTableColumns(columns: ComputedRef<ColumnDef<any, any>[]> | ColumnDef<any, any>[], options: DataTableColumnsOptions = {}): ComputedRef<ColumnDef<any, any>[]> {
  const { enableRowSelection = false, enableExpanding = false } = options;

  return computed(() => {
    const cols: ColumnDef<any, any>[] = [];
    const sourceColumns = Array.isArray(columns) ? columns : columns.value;

    // 插入选择列
    if (enableRowSelection) {
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

    // 插入展开列
    if (enableExpanding) {
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

    // 添加原始列
    cols.push(...sourceColumns);
    return cols;
  });
}
