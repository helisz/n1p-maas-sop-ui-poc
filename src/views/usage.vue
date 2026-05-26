<!-- [AI_START TIMESTAMP=2025-08-12 08:00:00] -->
<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    layout: 'PortalLayout',
  },
});

import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

interface UsageRecord {
  id: string;
  apiKeyName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  usageTime: string;
  result: 'success' | 'failed';
  resultMessage?: string;
}

const allRecords: UsageRecord[] = [
  { id: '1', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 1200, outputTokens: 850, totalTokens: 2050, usageTime: '2025-08-10 14:32:15', result: 'success' },
  { id: '2', apiKeyName: '测试环境密钥', model: 'gpt-4o-mini', inputTokens: 340, outputTokens: 120, totalTokens: 460, usageTime: '2025-08-10 13:15:30', result: 'success' },
  { id: '3', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 5600, outputTokens: 2100, totalTokens: 7700, usageTime: '2025-08-10 11:45:00', result: 'failed', resultMessage: 'Rate limit exceeded' },
  { id: '4', apiKeyName: '生产环境密钥', model: 'claude-3-5-sonnet', inputTokens: 890, outputTokens: 430, totalTokens: 1320, usageTime: '2025-08-09 18:22:10', result: 'success' },
  { id: '5', apiKeyName: '测试环境密钥', model: 'gpt-4o', inputTokens: 120, outputTokens: 60, totalTokens: 180, usageTime: '2025-08-09 16:05:45', result: 'success' },
  { id: '6', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 4500, outputTokens: 1800, totalTokens: 6300, usageTime: '2025-08-09 10:30:00', result: 'success' },
  { id: '7', apiKeyName: '测试环境密钥', model: 'claude-3-5-sonnet', inputTokens: 2300, outputTokens: 980, totalTokens: 3280, usageTime: '2025-08-08 09:12:20', result: 'failed', resultMessage: 'Token limit exceeded' },
  { id: '8', apiKeyName: '生产环境密钥', model: 'gpt-4o-mini', inputTokens: 560, outputTokens: 210, totalTokens: 770, usageTime: '2025-08-08 08:45:30', result: 'success' },
  { id: '9', apiKeyName: '测试环境密钥', model: 'gpt-4o', inputTokens: 780, outputTokens: 340, totalTokens: 1120, usageTime: '2025-08-07 20:18:00', result: 'success' },
  { id: '10', apiKeyName: '生产环境密钥', model: 'claude-3-5-sonnet', inputTokens: 3200, outputTokens: 1500, totalTokens: 4700, usageTime: '2025-08-07 15:40:10', result: 'success' },
  { id: '11', apiKeyName: '测试环境密钥', model: 'gpt-4o-mini', inputTokens: 90, outputTokens: 40, totalTokens: 130, usageTime: '2025-08-06 12:25:00', result: 'success' },
  { id: '12', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 2100, outputTokens: 890, totalTokens: 2990, usageTime: '2025-08-06 08:10:15', result: 'success' },
  { id: '13', apiKeyName: '测试环境密钥', model: 'gpt-4o', inputTokens: 1500, outputTokens: 600, totalTokens: 2100, usageTime: '2025-08-05 19:55:30', result: 'failed', resultMessage: 'Invalid API key' },
  { id: '14', apiKeyName: '生产环境密钥', model: 'claude-3-5-sonnet', inputTokens: 670, outputTokens: 280, totalTokens: 950, usageTime: '2025-08-05 14:20:00', result: 'success' },
  { id: '15', apiKeyName: '测试环境密钥', model: 'gpt-4o-mini', inputTokens: 420, outputTokens: 180, totalTokens: 600, usageTime: '2025-08-04 11:05:00', result: 'success' },
  { id: '16', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 5400, outputTokens: 2200, totalTokens: 7600, usageTime: '2025-08-04 07:30:00', result: 'success' },
  { id: '17', apiKeyName: '测试环境密钥', model: 'claude-3-5-sonnet', inputTokens: 1100, outputTokens: 450, totalTokens: 1550, usageTime: '2025-08-03 22:15:00', result: 'success' },
  { id: '18', apiKeyName: '生产环境密钥', model: 'gpt-4o-mini', inputTokens: 230, outputTokens: 90, totalTokens: 320, usageTime: '2025-08-03 16:40:00', result: 'success' },
  { id: '19', apiKeyName: '测试环境密钥', model: 'gpt-4o', inputTokens: 890, outputTokens: 360, totalTokens: 1250, usageTime: '2025-08-02 10:20:00', result: 'success' },
  { id: '20', apiKeyName: '生产环境密钥', model: 'claude-3-5-sonnet', inputTokens: 3100, outputTokens: 1300, totalTokens: 4400, usageTime: '2025-08-02 08:00:00', result: 'success' },
  { id: '21', apiKeyName: '测试环境密钥', model: 'gpt-4o-mini', inputTokens: 180, outputTokens: 70, totalTokens: 250, usageTime: '2025-08-01 21:45:00', result: 'failed', resultMessage: 'Timeout' },
  { id: '22', apiKeyName: '生产环境密钥', model: 'gpt-4o', inputTokens: 4200, outputTokens: 1900, totalTokens: 6100, usageTime: '2025-08-01 15:10:00', result: 'success' },
  { id: '23', apiKeyName: '测试环境密钥', model: 'claude-3-5-sonnet', inputTokens: 750, outputTokens: 300, totalTokens: 1050, usageTime: '2025-08-01 09:30:00', result: 'success' },
  { id: '24', apiKeyName: '生产环境密钥', model: 'gpt-4o-mini', inputTokens: 340, outputTokens: 140, totalTokens: 480, usageTime: '2025-07-31 18:00:00', result: 'success' },
  { id: '25', apiKeyName: '测试环境密钥', model: 'gpt-4o', inputTokens: 2600, outputTokens: 1100, totalTokens: 3700, usageTime: '2025-07-31 14:25:00', result: 'success' },
];

const apiKeyOptions = ['全部', '生产环境密钥', '测试环境密钥'];

const filterApiKey = ref('全部');
const filterStartDate = ref('');
const filterEndDate = ref('');

const pageSize = 10;
const currentPage = ref(1);

const filteredRecords = computed(() => {
  return allRecords.filter((record) => {
    if (filterApiKey.value !== '全部' && record.apiKeyName !== filterApiKey.value) {
      return false;
    }
    if (filterStartDate.value) {
      const start = new Date(filterStartDate.value + 'T00:00:00');
      const recordDate = new Date(record.usageTime.replace(' ', 'T'));
      if (recordDate < start) return false;
    }
    if (filterEndDate.value) {
      const end = new Date(filterEndDate.value + 'T23:59:59');
      const recordDate = new Date(record.usageTime.replace(' ', 'T'));
      if (recordDate > end) return false;
    }
    return true;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / pageSize)));

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredRecords.value.slice(start, start + pageSize);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function exportData() {
  const headers = ['API Key 名称', '使用模型', '输入数', '输出数', '总Token数', '使用时间', '使用结果'];
  const rows = filteredRecords.value.map((r) => [r.apiKeyName, r.model, r.inputTokens, r.outputTokens, r.totalTokens, r.usageTime, r.result === 'success' ? '成功' : `失败: ${r.resultMessage || ''}`]);
  const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `使用记录_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function clearFilters() {
  filterApiKey.value = '全部';
  filterStartDate.value = '';
  filterEndDate.value = '';
  currentPage.value = 1;
}

const pageNumbers = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;
  if (totalPages.value <= maxVisible + 2) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages.value);
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages.value);
    }
  }
  return pages;
});

// Chart logic
interface DailyStat {
  date: string;
  input: number;
  output: number;
  total: number;
}

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartContainer = ref<HTMLDivElement | null>(null);

const dailyStats = computed(() => {
  const map = new Map<string, DailyStat>();
  filteredRecords.value.forEach((r) => {
    const date = r.usageTime.slice(0, 10);
    if (!map.has(date)) {
      map.set(date, { date, input: 0, output: 0, total: 0 });
    }
    const stat = map.get(date)!;
    stat.input += r.inputTokens;
    stat.output += r.outputTokens;
    stat.total += r.totalTokens;
  });
  const arr = Array.from(map.values());
  arr.sort((a, b) => a.date.localeCompare(b.date));
  return arr;
});

function niceStep(maxValue: number, ticks: number): number {
  const rough = maxValue / ticks;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
  const d = rough / pow10;
  let nice = 1;
  if (d < 1.5) nice = 1;
  else if (d < 3) nice = 2;
  else if (d < 7) nice = 5;
  else nice = 10;
  return nice * pow10;
}

function drawChart() {
  const canvas = chartCanvas.value;
  const container = chartContainer.value;
  if (!canvas || !container) return;
  const rect = container.getBoundingClientRect();
  if (rect.width === 0) {
    requestAnimationFrame(drawChart);
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = rect.width;
  const height = 260;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const data = dailyStats.value;
  if (data.length === 0) return;

  const padding = { top: 24, right: 16, bottom: 40, left: 56 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => Math.max(d.input, d.output, d.total)));
  const yTicks = 5;
  const step = niceStep(maxValue, yTicks);
  const yMax = step * yTicks;

  // Grid & Y labels
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#6B7280';
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= yTicks; i++) {
    const value = i * step;
    const y = padding.top + chartH - (value / yMax) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(String(Math.round(value)), padding.left - 8, y);
  }

  // Y axis line
  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.stroke();

  // Bars (grouped: input, output, total)
  const groupCount = data.length;
  const groupGap = Math.max(8, 40 / groupCount);
  const barGap = 2;
  const barWidth = (chartW - (groupCount - 1) * groupGap) / groupCount / 3 - barGap;
  const effectiveBarWidth = Math.max(4, barWidth);

  const colors = ['#3B82F6', '#10B981', '#6366F1']; // blue, emerald, indigo

  data.forEach((stat, gi) => {
    const groupX = padding.left + gi * ((chartW - (groupCount - 1) * groupGap) / groupCount) + groupGap / 2;
    const values = [stat.input, stat.output, stat.total];
    values.forEach((val, vi) => {
      const x = groupX + vi * (effectiveBarWidth + barGap);
      const barHeight = (val / yMax) * chartH;
      const y = padding.top + chartH - barHeight;
      ctx.fillStyle = colors[vi];
      ctx.fillRect(x, y, effectiveBarWidth, barHeight);
    });

    // Date label
    const labelX = groupX + (effectiveBarWidth * 3 + barGap * 2) / 2;
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(stat.date.slice(5), labelX, height - padding.bottom + 8);
  });

  // Legend
  const legendItems = [
    { label: '输入数', color: colors[0] },
    { label: '输出数', color: colors[1] },
    { label: '总Token数', color: colors[2] },
  ];
  let legendX = width - padding.right;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = legendItems.length - 1; i >= 0; i--) {
    const item = legendItems[i];
    const textWidth = ctx.measureText(item.label).width;
    legendX -= textWidth + 16;
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, 8, 10, 10);
    ctx.fillStyle = '#374151';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.label, legendX + textWidth + 14, 13);
    legendX -= 24;
  }
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => drawChart());
    resizeObserver.observe(chartContainer.value);
  }
  window.addEventListener('resize', drawChart);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener('resize', drawChart);
});

watch([filteredRecords, chartCanvas], () => {
  nextTick(() => {
    requestAnimationFrame(drawChart);
  });
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-foreground text-2xl font-semibold">使用记录</h2>
      <p class="text-muted-foreground">查看 API 密钥的详细调用记录</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-end gap-4">
      <div class="space-y-2">
        <Label class="text-xs">API Key 名称</Label>
        <Select v-model="filterApiKey">
          <SelectTrigger class="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in apiKeyOptions" :key="opt" :value="opt">{{ opt }}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label class="text-xs">开始日期</Label>
        <Input type="date" v-model="filterStartDate" class="w-40" />
      </div>

      <div class="space-y-2">
        <Label class="text-xs">结束日期</Label>
        <Input type="date" v-model="filterEndDate" class="w-40" />
      </div>

      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="clearFilters">重置</Button>
        <Button size="sm" @click="exportData"><ArrowDownTrayIcon class="mr-1 h-4 w-4" />导出</Button>
      </div>
    </div>

    <!-- Chart -->
    <div ref="chartContainer" class="w-full my-2">
      <canvas ref="chartCanvas" />
    </div>

    <!-- Table -->
    <Card>
      <CardContent class="px-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Key名称</TableHead>
              <TableHead>使用模型</TableHead>
              <TableHead class="text-right">输入数</TableHead>
              <TableHead class="text-right">输出数</TableHead>
              <TableHead class="text-right">总Token数</TableHead>
              <TableHead>使用时间</TableHead>
              <TableHead>使用结果</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="record in paginatedRecords" :key="record.id">
              <TableCell class="font-medium">{{ record.apiKeyName }}</TableCell>
              <TableCell>{{ record.model }}</TableCell>
              <TableCell class="text-right">{{ record.inputTokens.toLocaleString() }}</TableCell>
              <TableCell class="text-right">{{ record.outputTokens.toLocaleString() }}</TableCell>
              <TableCell class="text-right">{{ record.totalTokens.toLocaleString() }}</TableCell>
              <TableCell class="text-muted-foreground">{{ record.usageTime }}</TableCell>
              <TableCell>
                <Badge v-if="record.result === 'success'" variant="outline" class="gap-1 text-green-600">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
                  成功
                </Badge>
                <Badge v-else variant="outline" class="gap-1 text-red-600">
                  <span class="h-1.5 w-1.5 rounded-full bg-red-500" />
                  失败
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow v-if="paginatedRecords.length === 0">
              <TableCell colspan="7" class="text-muted-foreground py-8 text-center"> 暂无记录 </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <!-- Pagination -->
      <CardFooter class="flex items-center justify-between border-t px-6 py-4">
        <div class="text-muted-foreground text-sm">共 {{ filteredRecords.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页</div>
        <div class="flex items-center gap-1">
          <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === 1" @click="prevPage">
            <ChevronLeftIcon class="h-4 w-4" />
          </Button>
          <Button v-for="page in pageNumbers" :key="page" variant="outline" size="sm" class="h-8 w-8 px-0" :class="page === currentPage ? 'bg-accent text-accent-foreground font-medium' : ''" :disabled="page === '...'" @click="typeof page === 'number' && goToPage(page)">
            {{ page }}
          </Button>
          <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === totalPages" @click="nextPage">
            <ChevronRightIcon class="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
<!-- [AI_END LINES=310 TIMESTAMP=2025-08-12 08:00:00] -->
