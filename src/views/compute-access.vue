<!-- [AI_START TIMESTAMP=2025-07-22 12:00:00] -->
<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    layout: 'PortalLayout',
  },
});

import { PlusIcon, TrashIcon, CheckCircleIcon, NoSymbolIcon, PlayIcon, MagnifyingGlassIcon, KeyIcon, ServerIcon, ExclamationTriangleIcon, InformationCircleIcon, BuildingOffice2Icon, GlobeAltIcon, CpuChipIcon } from '@heroicons/vue/24/outline';

interface Enterprise {
  id: string;
  name: string;
}

interface ApiUser {
  id: string;
  username: string;
  enterpriseId: string;
  enterpriseName: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

interface Channel {
  id: string;
  name: string;
  userId: string;
  enterpriseId: string;
  enterpriseName: string;
  models: string[];
  apiBaseUrl: string;
  apiKey: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

const enterprises = ref<Enterprise[]>([
  { id: 'ENT001', name: '华为云科技' },
  { id: 'ENT002', name: '阿里云数' },
  { id: 'ENT003', name: '腾讯云智' },
  { id: 'ENT004', name: '百度智能' },
  { id: 'ENT005', name: '字节跳动' },
]);

const modelOptions = ['Doubao-Seed-2.0-pro', 'Doubao-Seed-2.0-lite', 'Doubao-1.5-pro-32k', 'DeepSeek-R1', 'DeepSeek-V3', 'DeepSeek-V3.2', 'DeepSeek-V4-Flash', 'Qwen3-235B-A22B', 'Qwen3-32B', 'Qwen2.5-72B', 'GLM-5', 'GLM-5.1', 'Qwen3-Coder-480B', 'Kimi-K2.6'];

const apiUsers = ref<ApiUser[]>([
  {
    id: 'USR001',
    username: 'huawei_admin',
    enterpriseId: 'ENT001',
    enterpriseName: '华为云科技',
    status: 'active',
    createdAt: '2025-07-20 10:00:00',
  },
  {
    id: 'USR002',
    username: 'aliyun_admin',
    enterpriseId: 'ENT002',
    enterpriseName: '阿里云数',
    status: 'active',
    createdAt: '2025-07-21 14:30:00',
  },
]);

const channels = ref<Channel[]>([
  {
    id: 'CH001',
    name: '华为-生产渠道',
    userId: 'USR001',
    enterpriseId: 'ENT001',
    enterpriseName: '华为云科技',
    models: ['DeepSeek-R1', 'Doubao-Seed-2.0-pro'],
    apiBaseUrl: 'https://api.huaweicloud.com/v1',
    apiKey: 'sk-huawei-xxxxxxxx1234',
    status: 'active',
    createdAt: '2025-07-20 11:00:00',
  },
  {
    id: 'CH002',
    name: '华为-测试渠道',
    userId: 'USR001',
    enterpriseId: 'ENT001',
    enterpriseName: '华为云科技',
    models: ['DeepSeek-V3'],
    apiBaseUrl: 'https://api.huaweicloud.com/v1',
    apiKey: 'sk-huawei-xxxxxxxx5678',
    status: 'active',
    createdAt: '2025-07-20 12:00:00',
  },
  {
    id: 'CH003',
    name: '阿里-生产渠道',
    userId: 'USR002',
    enterpriseId: 'ENT002',
    enterpriseName: '阿里云数',
    models: ['DeepSeek-V3', 'Qwen3-235B-A22B'],
    apiBaseUrl: 'https://api.aliyun.com/v1',
    apiKey: 'sk-aliyun-xxxxxxxx9876',
    status: 'active',
    createdAt: '2025-07-21 15:00:00',
  },
]);

const userSearch = ref('');
const channelSearch = ref('');
const createUserOpen = ref(false);
const createChannelOpen = ref(false);

const newUserForm = ref({
  enterpriseId: '',
  username: '',
});

const newChannelForm = ref({
  userId: '',
  name: '',
  models: [] as string[],
  apiBaseUrl: '',
  apiKeys: '',
});

const selectedUserForChannel = computed(() => apiUsers.value.find((u) => u.id === newChannelForm.value.userId));

const filteredUsers = computed(() => {
  let result = apiUsers.value;
  if (userSearch.value.trim()) {
    const q = userSearch.value.toLowerCase();
    result = result.filter((u) => u.id.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.enterpriseName.toLowerCase().includes(q));
  }
  return result;
});

const filteredChannels = computed(() => {
  let result = channels.value;
  if (channelSearch.value.trim()) {
    const q = channelSearch.value.toLowerCase();
    result = result.filter((c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.models.some((m) => m.toLowerCase().includes(q)) || c.enterpriseName.toLowerCase().includes(q));
  }
  return result;
});

const stats = computed(() => {
  const groupSet = new Set(channels.value.map((c) => c.enterpriseId));
  return {
    totalUsers: apiUsers.value.length,
    activeUsers: apiUsers.value.filter((u) => u.status === 'active').length,
    totalChannels: channels.value.length,
    groups: groupSet.size,
  };
});

function toggleModelSelection(model: string) {
  const idx = newChannelForm.value.models.indexOf(model);
  if (idx >= 0) {
    newChannelForm.value.models.splice(idx, 1);
  } else {
    newChannelForm.value.models.push(model);
  }
}

function submitCreateUser() {
  if (!newUserForm.value.enterpriseId || !newUserForm.value.username.trim()) return;
  const ent = enterprises.value.find((e) => e.id === newUserForm.value.enterpriseId);
  if (!ent) return;
  const id = `USR${String(apiUsers.value.length + 1).padStart(3, '0')}`;
  apiUsers.value.push({
    id,
    username: newUserForm.value.username.trim(),
    enterpriseId: ent.id,
    enterpriseName: ent.name,
    status: 'active',
    createdAt: new Date()
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '-'),
  });
  newUserForm.value.enterpriseId = '';
  newUserForm.value.username = '';
  createUserOpen.value = false;
}

function submitCreateChannel() {
  if (!newChannelForm.value.userId || !newChannelForm.value.name.trim() || newChannelForm.value.models.length === 0 || !newChannelForm.value.apiBaseUrl.trim()) return;
  const user = apiUsers.value.find((u) => u.id === newChannelForm.value.userId);
  if (!user) return;
  const keys = newChannelForm.value.apiKeys
    .split('\n')
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
  const baseName = newChannelForm.value.name.trim();
  const names = keys.length <= 1 ? [baseName] : keys.map((_k, i) => `${baseName}-${i + 1}`);
  const usedKeys = keys.length > 0 ? keys : ['未配置'];
  usedKeys.forEach((key, idx) => {
    const id = `CH${String(channels.value.length + 1).padStart(3, '0')}`;
    channels.value.push({
      id,
      name: names[idx] || baseName,
      userId: user.id,
      enterpriseId: user.enterpriseId,
      enterpriseName: user.enterpriseName,
      models: [...newChannelForm.value.models],
      apiBaseUrl: newChannelForm.value.apiBaseUrl.trim(),
      apiKey: key,
      status: 'active',
      createdAt: new Date()
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '-'),
    });
  });
  newChannelForm.value.userId = '';
  newChannelForm.value.name = '';
  newChannelForm.value.models = [];
  newChannelForm.value.apiBaseUrl = '';
  newChannelForm.value.apiKeys = '';
  createChannelOpen.value = false;
}

function toggleUserStatus(user: ApiUser) {
  user.status = user.status === 'active' ? 'disabled' : 'active';
}

function toggleChannelStatus(channel: Channel) {
  channel.status = channel.status === 'active' ? 'disabled' : 'active';
}

function deleteChannel(channel: Channel) {
  channels.value = channels.value.filter((c) => c.id !== channel.id);
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-foreground text-2xl font-semibold">算力接入</h2>
      <p class="text-muted-foreground">管理 New API User 与算力渠道配置</p>
    </div>

    <!-- Unified Stats -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">总 User 数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">已启用 User</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">{{ stats.activeUsers }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">总渠道数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalChannels }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">分组数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-blue-600">{{ stats.groups }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- API User Section -->
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <KeyIcon class="text-primary h-5 w-5" />
        <h3 class="text-lg font-semibold">New API User</h3>
      </div>

      <Card>
        <CardHeader>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2">
              <CardTitle>User 列表</CardTitle>
              <span class="text-muted-foreground text-sm font-normal">（共 {{ filteredUsers.length }} 个）</span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative">
                <MagnifyingGlassIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input v-model="userSearch" placeholder="搜索 User ID、用户名或企业..." class="w-64 pl-8" />
              </div>
              <Button size="sm" @click="createUserOpen = true">
                <PlusIcon class="mr-1 h-4 w-4" />
                新建 User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>企业</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead class="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in filteredUsers" :key="user.id">
                  <TableCell class="text-muted-foreground text-xs">{{ user.id }}</TableCell>
                  <TableCell class="text-sm font-medium">{{ user.username }}</TableCell>
                  <TableCell class="flex items-center gap-1.5 text-sm">
                    <BuildingOffice2Icon class="text-muted-foreground h-3.5 w-3.5" />
                    {{ user.enterpriseName }}
                  </TableCell>
                  <TableCell>
                    <Badge v-if="user.status === 'active'" variant="outline" class="gap-1 border-green-200 bg-green-50 text-green-700">
                      <CheckCircleIcon class="h-3 w-3" />
                      启用
                    </Badge>
                    <Badge v-else variant="outline" class="gap-1 border-red-200 bg-red-50 text-red-700">
                      <NoSymbolIcon class="h-3 w-3" />
                      停用
                    </Badge>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-sm">{{ user.createdAt }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Button v-if="user.status === 'active'" variant="ghost" size="sm" class="text-destructive" @click="toggleUserStatus(user)"> 停用 </Button>
                      <Button v-else variant="ghost" size="sm" @click="toggleUserStatus(user)">
                        <PlayIcon class="mr-1 h-3 w-3" />
                        启用
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableEmpty v-if="filteredUsers.length === 0">
                  <div class="text-muted-foreground flex flex-col items-center justify-center py-8">
                    <InformationCircleIcon class="mb-2 h-8 w-8 opacity-50" />
                    <p>暂无 User 数据</p>
                  </div>
                </TableEmpty>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Channel Section -->
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <ServerIcon class="text-primary h-5 w-5" />
        <h3 class="text-lg font-semibold">渠道管理</h3>
      </div>

      <!-- Alert if no users -->
      <div v-if="apiUsers.length === 0" class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <ExclamationTriangleIcon class="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p class="text-sm font-medium">暂无可用 User</p>
          <p class="text-xs opacity-80">请先新建 User，才能创建渠道。</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2">
              <CardTitle>渠道列表</CardTitle>
              <span class="text-muted-foreground text-sm font-normal">（共 {{ filteredChannels.length }} 个）</span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative">
                <MagnifyingGlassIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input v-model="channelSearch" placeholder="搜索渠道、模型或企业..." class="w-64 pl-8" />
              </div>
              <Button size="sm" :disabled="apiUsers.length === 0" @click="createChannelOpen = true">
                <PlusIcon class="mr-1 h-4 w-4" />
                新建渠道
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>渠道 ID</TableHead>
                  <TableHead>渠道名称</TableHead>
                  <TableHead>所属 User</TableHead>
                  <TableHead>分组</TableHead>
                  <TableHead>模型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead class="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="ch in filteredChannels" :key="ch.id">
                  <TableCell class="text-muted-foreground text-xs">{{ ch.id }}</TableCell>
                  <TableCell class="text-sm font-medium">{{ ch.name }}</TableCell>
                  <TableCell class="text-muted-foreground text-xs">{{ ch.userId }}</TableCell>
                  <TableCell class="text-sm">
                    {{ ch.enterpriseName }}
                  </TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-1">
                      <Badge v-for="m in ch.models" :key="m" variant="outline" class="text-xs">
                        <CpuChipIcon class="mr-1 h-3 w-3" />
                        {{ m }}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge v-if="ch.status === 'active'" variant="outline" class="gap-1 border-green-200 bg-green-50 text-green-700">
                      <CheckCircleIcon class="h-3 w-3" />
                      启用
                    </Badge>
                    <Badge v-else variant="outline" class="gap-1 border-red-200 bg-red-50 text-red-700">
                      <NoSymbolIcon class="h-3 w-3" />
                      停用
                    </Badge>
                  </TableCell>
                  <TableCell class="text-muted-foreground text-sm">{{ ch.createdAt }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Button v-if="ch.status === 'active'" variant="ghost" size="sm" class="text-destructive" @click="toggleChannelStatus(ch)"> 停用 </Button>
                      <Button v-else variant="ghost" size="sm" @click="toggleChannelStatus(ch)">
                        <PlayIcon class="mr-1 h-3 w-3" />
                        启用
                      </Button>
                      <Button variant="ghost" size="sm" class="text-destructive" @click="deleteChannel(ch)">
                        <TrashIcon class="mr-1 h-3 w-3" />
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableEmpty v-if="filteredChannels.length === 0">
                  <div class="text-muted-foreground flex flex-col items-center justify-center py-8">
                    <ServerIcon class="mb-2 h-8 w-8 opacity-50" />
                    <p>暂无渠道数据</p>
                  </div>
                </TableEmpty>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Create User Dialog -->
    <Dialog v-model:open="createUserOpen">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>新建 API User</DialogTitle>
          <DialogDescription>选择企业并设置用户名</DialogDescription>
        </DialogHeader>
        <div class="max-h-[60vh] space-y-4 overflow-y-auto py-2 pr-3">
          <div class="space-y-2">
            <Label>选择企业</Label>
            <Select v-model="newUserForm.enterpriseId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="请选择企业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="ent in enterprises" :key="ent.id" :value="ent.id">
                  {{ ent.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>用户名</Label>
            <Input v-model="newUserForm.username" placeholder="请输入用户名" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="createUserOpen = false">取消</Button>
          <Button :disabled="!newUserForm.enterpriseId || !newUserForm.username.trim()" @click="submitCreateUser">确认创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Create Channel Dialog -->
    <Dialog v-model:open="createChannelOpen">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>新建渠道</DialogTitle>
          <DialogDescription>配置模型、API 地址等渠道信息</DialogDescription>
        </DialogHeader>
        <div class="max-h-[60vh] space-y-4 overflow-y-auto py-2 pr-3">
          <div class="space-y-2">
            <Label>所属 User</Label>
            <Select v-model="newChannelForm.userId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="请选择 User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="user in apiUsers" :key="user.id" :value="user.id"> {{ user.id }}（{{ user.enterpriseName }}） </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div v-if="selectedUserForChannel" class="bg-muted/50 flex items-center gap-2 rounded-md px-3 py-2 text-sm">
            <BuildingOffice2Icon class="text-muted-foreground h-4 w-4" />
            <span class="text-muted-foreground">分组：</span>
            <span class="font-medium">{{ selectedUserForChannel.enterpriseName }}</span>
          </div>
          <div class="space-y-2">
            <Label>渠道名称</Label>
            <Input v-model="newChannelForm.name" placeholder="请输入渠道名称" />
          </div>
          <div class="space-y-2">
            <Label>API Key</Label>
            <Textarea v-model="newChannelForm.apiKeys" placeholder="请输入 API Key，每行一个&#10;sk-xxxxxxxxxxxx1&#10;sk-xxxxxxxxxxxx2" class="min-h-[80px]" />
          </div>
          <div class="space-y-2">
            <Label>模型 </Label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="m in modelOptions"
                :key="m"
                type="button"
                @click="toggleModelSelection(m)"
                :class="['inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors', newChannelForm.models.includes(m) ? 'border-transparent bg-[#3841D8] text-white hover:bg-[#2d35b8]' : 'border-border bg-background text-foreground hover:bg-muted']"
              >
                <CpuChipIcon class="mr-1 h-3 w-3" />
                {{ m }}
              </button>
            </div>
            <p v-if="newChannelForm.models.length > 0" class="text-muted-foreground text-xs">已选 {{ newChannelForm.models.length }} 个模型</p>
          </div>
          <div class="space-y-2">
            <Label>API 地址</Label>
            <Input v-model="newChannelForm.apiBaseUrl" placeholder="例如 https://api.example.com/v1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="createChannelOpen = false">取消</Button>
          <Button :disabled="!newChannelForm.userId || !newChannelForm.name.trim() || newChannelForm.models.length === 0 || !newChannelForm.apiBaseUrl.trim()" @click="submitCreateChannel"> 确认创建 </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
<!-- [AI_END LINES=520 TIMESTAMP=2025-07-22 12:00:00] -->
