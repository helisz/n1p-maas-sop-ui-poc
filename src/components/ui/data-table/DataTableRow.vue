<script setup lang="ts">
import { FlexRender, type Row, type Column } from '@tanstack/vue-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Props {
  row: Row<any>;
  slots: Record<string, any>;
  finalColumns: any[];
  getPinningClass: (column: Column<any, any>) => string;
  getResizingClass: (column: Column<any, any>) => string;
  isSelected?: boolean;
  rowPinningClass?: string;
}

defineProps<Props>();
</script>

<template>
  <TableRow :data-state="isSelected && 'selected'" :class="cn(isSelected ? 'bg-muted' : '', rowPinningClass)">
    <TableCell
      v-for="cell in row.getVisibleCells()"
      :key="cell.id"
      :class="cn(getPinningClass(cell.column), getResizingClass(cell.column))"
      :style="{
        width: `${cell.column.getSize()}px`,
        minWidth: `${cell.column.getSize()}px`,
      }"
    >
      <template v-if="slots[`cell-${cell.column.id}`]">
        <FlexRender :render="slots[`cell-${cell.column.id}`]" :props="cell.getContext()" />
      </template>
      <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
    </TableCell>
  </TableRow>
</template>
