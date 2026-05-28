<!-- [AI_START TIMESTAMP=2025-07-18 14:00:00] -->
<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    layout: 'PortalLayout',
  },
});

import { createColumnHelper } from '@tanstack/vue-table';
import { MagnifyingGlassIcon, UserIcon, EnvelopeIcon, BuildingOffice2Icon, ClockIcon, PencilSquareIcon, KeyIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

// [AI_START TIMESTAMP=2025-07-21 10:30:00]
import { formatDateTime } from '@/utils/format';

// [AI_START TIMESTAMP=2025-07-21 11:00:00]
const ACCOUNT_TYPE_MAP: Record<string, { label: string; badgeClass: string }> = {
  USER: { label: '普通用户', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  ADMIN: { label: '管理员', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
};
// [AI_END LINES=5 TIMESTAMP=2025-07-21 11:00:00]

const loading = ref(false);
const keyword = ref('');
const accounts = ref<AccountListItemDTO[]>([]);
const total = ref(0);
const size = ref(10);

async function fetchAccounts() {
  loading.value = true;
  try {
    const res = await $listAccounts({
      keyword: keyword.value || undefined,
    });
    accounts.value = res.records;
    total.value = res.total;
    size.value = res.size;
  } catch {
    // error handled by http-client
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  fetchAccounts();
}

onMounted(() => {
  fetchAccounts();
});

// Stats
const stats = computed(() => ({
  total: total.value,
  superAdmin: '-',
  admin: '-',
  disabled: '-',
}));

// DataTable columns
const columnHelper = createColumnHelper<AccountListItemDTO>();

const columns = [
  columnHelper.accessor('accountId', {
    header: 'ID',
    cell: ({ row }) => h('span', { class: 'text-muted-foreground font-mono text-sm' }, String(row.original.accountId)),
  }),
  columnHelper.accessor('username', {
    header: '用户名',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.username),
  }),
  columnHelper.accessor('email', {
    header: '邮箱',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.email),
  }),
  columnHelper.accessor('enterpriseName', {
    header: '所属企业',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.enterpriseName || '-'),
  }),
  columnHelper.accessor('type', {
    header: '角色类型',
  }),
  columnHelper.accessor('createdAt', {
    header: '注册时间',
    cell: ({ row }) => h('span', { class: 'text-muted-foreground text-sm' }, formatDateTime(row.original.createdAt)),
  }),
  columnHelper.accessor('lastLogin', {
    header: '最后登录',
    cell: ({ row }) => h('span', { class: 'text-muted-foreground text-sm' }, formatDateTime(row.original.lastLogin)),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, '操作'),
    cell: () => null,
    size: 180,
    meta: { pinned: 'right' },
  }),
];

const editOpen = ref(false);
const resetPasswordOpen = ref(false);
const selectedAccount = ref<AccountListItemDTO | null>(null);

function handleEdit(account: AccountListItemDTO) {
  selectedAccount.value = account;
  editOpen.value = true;
}

function handleResetPassword(account: AccountListItemDTO) {
  selectedAccount.value = account;
  resetPasswordOpen.value = true;
}

function handleFreeze(account: AccountListItemDTO) {
  // TODO: 等待冻结 API 就绪后接入
  console.log('freeze account:', account.accountId);
}

function handleUnfreeze(account: AccountListItemDTO) {
  // TODO: 等待解冻 API 就绪后接入
  console.log('unfreeze account:', account.accountId);
}
// [AI_END LINES=120 TIMESTAMP=2025-07-21 10:30:00]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-foreground text-2xl font-semibold">用户账号管理</h2>
      <p class="text-muted-foreground">管理所有在平台注册的企业用户账号、认证与启用状态</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="pb-2"><CardTitle class="text-muted-foreground text-sm font-medium">总用户数</CardTitle></CardHeader>
        <CardContent
          ><div class="text-2xl font-bold">{{ stats.total }}</div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardTitle class="text-muted-foreground text-sm font-medium">管理员</CardTitle></CardHeader>
        <CardContent
          ><div class="text-2xl font-bold text-blue-600">{{ stats.superAdmin }}</div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardTitle class="text-muted-foreground text-sm font-medium">普通用户</CardTitle></CardHeader>
        <CardContent
          ><div class="text-2xl font-bold text-amber-600">{{ stats.admin }}</div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardTitle class="text-muted-foreground text-sm font-medium">已冻结</CardTitle></CardHeader>
        <CardContent
          ><div class="text-2xl font-bold text-red-600">{{ stats.disabled }}</div></CardContent
        >
      </Card>
    </div>

    <!-- User Table Card -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <UserIcon class="text-primary h-5 w-5" />
            <CardTitle>用户列表</CardTitle>
            <span class="text-muted-foreground text-sm font-normal">（共 {{ total }} 人）</span>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative">
              <MagnifyingGlassIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input v-model="keyword" placeholder="搜索用户名、邮箱..." class="w-56 pl-8" @keyup.enter="handleSearch" />
            </div>
            <Button @click="handleSearch">搜索</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div v-if="loading" class="text-muted-foreground py-8 text-center">加载中...</div>
        <!-- [AI_START TIMESTAMP=2025-07-21 16:00:00] -->
        <DataTable v-else :columns="columns" :data="accounts" enable-pagination :page-size="size">
          <template #cell-type="{ row }">
            <Badge variant="outline" :class="`text-xs ${ACCOUNT_TYPE_MAP[row.original.type]?.badgeClass || ''}`">
              {{ ACCOUNT_TYPE_MAP[row.original.type]?.label || row.original.type || '-' }}
            </Badge>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="sm" @click="handleEdit(row.original)"> <PencilSquareIcon class="mr-1 h-3 w-3" />编辑 </Button>
              <Button variant="ghost" size="sm" @click="handleResetPassword(row.original)"> <KeyIcon class="mr-1 h-3 w-3" />重置密码 </Button>
              <Button v-if="row.original.status === 'FROZEN'" variant="ghost" size="sm" @click="handleUnfreeze(row.original)"> <CheckCircleIcon class="mr-1 h-3 w-3 text-green-600" />解冻 </Button>
              <Button v-else variant="ghost" size="sm" @click="handleFreeze(row.original)"> <NoSymbolIcon class="mr-1 h-3 w-3 text-red-600" />冻结 </Button>
            </div>
          </template>
        </DataTable>
        <!-- [AI_END LINES=22 TIMESTAMP=2025-07-21 16:00:00] -->
      </CardContent>
    </Card>

    <!-- Edit Dialog (merged with detail) -->
    <Dialog v-model:open="editOpen">
      <DialogContent class="max-w-lg">
        <div v-if="selectedAccount" class="max-h-[60vh] space-y-4 overflow-y-auto py-2">
          <!-- Display Info (read-only) -->
          <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <span class="text-primary text-lg font-semibold">{{ selectedAccount.username?.charAt(0) || '?' }}</span>
              </div>
              <div>
                <p class="text-foreground text-lg font-semibold">{{ selectedAccount.username }}</p>
                <p class="text-muted-foreground font-mono text-xs">ID: {{ selectedAccount.accountId }}</p>
              </div>
            </div>
            <Separator />
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 text-sm">
                <BuildingOffice2Icon class="text-muted-foreground h-4 w-4 shrink-0" />
                <span class="text-muted-foreground shrink-0">企业：</span>
                <span>{{ selectedAccount.enterpriseName || '-' }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <ClockIcon class="text-muted-foreground h-4 w-4 shrink-0" />
                <span class="text-muted-foreground shrink-0">注册时间：</span>
                <span>{{ formatDateTime(selectedAccount.createdAt) }}</span>
              </div>
              <div class="col-span-2 flex items-center gap-2 text-sm">
                <ClockIcon class="text-muted-foreground h-4 w-4 shrink-0" />
                <span class="text-muted-foreground shrink-0">最后登录：</span>
                <span>{{ formatDateTime(selectedAccount.lastLogin) }}</span>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="space-y-3">
            <h4 class="text-foreground text-sm font-semibold">编辑信息</h4>
            <div class="space-y-2"><Label>邮箱</Label><Input :default-value="selectedAccount.email" /></div>
            <div class="space-y-2">
              <Label>角色类型</Label>
              <Select :default-value="selectedAccount.type">
                <SelectTrigger class="w-full"><SelectValue placeholder="选择角色类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="(item, key) in ACCOUNT_TYPE_MAP" :key="key" :value="key">{{ item.label }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editOpen = false">取消</Button>
          <Button @click="editOpen = false">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Reset Password Dialog -->
    <Dialog v-model:open="resetPasswordOpen">
      <DialogContent>
        <DialogHeader
          ><DialogTitle>重置密码</DialogTitle><DialogDescription>为用户 {{ selectedAccount?.username }} 重置密码</DialogDescription></DialogHeader
        >
        <div v-if="selectedAccount" class="space-y-4">
          <div class="space-y-2"><Label>新密码</Label><Input type="password" placeholder="请输入新密码" /></div>
          <div class="space-y-2"><Label>确认密码</Label><Input type="password" placeholder="请再次输入新密码" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="resetPasswordOpen = false">取消</Button>
          <Button @click="resetPasswordOpen = false">确认重置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
<!-- [AI_END LINES=290 TIMESTAMP=2025-07-21 16:00:00] -->
