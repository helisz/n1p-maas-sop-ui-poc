<!-- [AI_START TIMESTAMP=2025-06-20 06:30:00] -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cn } from '@/lib/utils';
import { Squares2X2Icon, CubeIcon, ShoppingCartIcon, SparklesIcon, WalletIcon, ReceiptPercentIcon, DocumentTextIcon, BuildingOffice2Icon, PresentationChartLineIcon, ChevronLeftIcon, MagnifyingGlassIcon, CheckBadgeIcon, UserGroupIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(
  defineProps<{
    mobileOpen?: boolean;
  }>(),
  {
    mobileOpen: false,
  },
);

const route = useRoute();
const router = useRouter();
const collapsed = ref(false);
const menuGroups = [
  {
    items: [{ title: '控制台首页', href: '/dashboard', icon: Squares2X2Icon }],
  },
  {
    label: '用户和企业管理',
    items: [
      { title: '用户账号管理', href: '/user-accounts', icon: UserGroupIcon },

      { title: '企业管理', href: '/enterprise', icon: BuildingOffice2Icon },
      // [AI_START TIMESTAMP=2025-07-18 13:00:00]
      // [AI_END LINES=1 TIMESTAMP=2025-07-18 13:00:00]
    ],
  },
  {
    label: '服务管理',
    items: [
      { title: '套餐管理', href: '/packages', icon: CubeIcon },
      { title: '模型管理', href: '/models', icon: SparklesIcon },
      // [AI_START TIMESTAMP=2025-07-16 06:10:00]
      { title: '已订购服务管理', href: '/services/subscribed', icon: CheckBadgeIcon },
      // [AI_END LINES=1 TIMESTAMP=2025-07-16 06:10:00]
    ],
  },
  {
    label: '交易管理',
    items: [{ title: '订单管理', href: '/orders', icon: ShoppingCartIcon }],
  },
  {
    label: '财务中心',
    items: [
      // { title: '资金管理', href: '/wallet', icon: WalletIcon },
      { title: '账单管理', href: '/billing', icon: ReceiptPercentIcon },
    ],
  },

  {
    label: '运营监控',
    items: [
      { title: '用量监控', href: '/usage', icon: PresentationChartLineIcon },
      { title: '审计日志', href: '/audit', icon: DocumentTextIcon },
    ],
  },
];

function navigate(href: string) {
  router.push(href);
}
</script>

<template>
  <!-- Mobile overlay backdrop -->
  <Transition name="sidebar-fade">
    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" @click="emit('close')" />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="
      cn(
        'flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out',
        'fixed z-50 lg:static',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'w-[4rem]' : 'w-[15.5rem]',
      )
    "
  >
    <!-- Logo -->
    <div class="flex h-[3.5rem] items-center justify-between border-b border-sidebar-border px-4">
      <div class="flex items-center gap-2.5 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-7 w-7 shrink-0">
          <rect width="32" height="32" rx="6" fill="#3841D8" />
          <path d="M16 7L7 12.5l9 5.5 9-5.5z" fill="#fff" opacity="0.95" />
          <path d="M7 16.5l9 5.5 9-5.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0.6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7 20l9 5.5 9-5.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0.35" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-if="!collapsed" class="text-foreground text-sm font-semibold whitespace-nowrap tracking-tight">企业统一服务门户 <span  class="text-red-600">POC</span></span>
      </div>
      <button v-if="!collapsed" class="text-muted-foreground hover:text-foreground hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors lg:hidden" @click="emit('close')">
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- Search -->
    <div v-if="!collapsed" class="px-3 pt-3 pb-1">
      <div class="relative">
        <MagnifyingGlassIcon class="text-muted-foreground absolute top-2 left-2.5 h-[14px] w-[14px]" />
        <Input
          placeholder="搜索功能..."
          class="bg-secondary/60 focus-visible:bg-background focus-visible:border-[#3841D8]/30 h-8 border-transparent pl-8 text-xs shadow-none transition-all placeholder:text-muted-foreground/60"
        />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 overflow-y-auto px-2.5 py-2">
      <template v-for="(group, gi) in menuGroups" :key="gi">
        <!-- Group label -->
        <div v-if="group.label && !collapsed" class="px-2.5 pt-4 pb-1.5">
          <span class="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{{ group.label }}</span>
          <div class="mt-1.5 h-[1px] bg-gradient-to-r from-border via-border/50 to-transparent" />
        </div>
        <div v-if="group.label && collapsed" class="mx-2 my-2 h-[1px] bg-border/60" />

        <!-- Menu items -->
        <button
          v-for="item in group.items"
          :key="item.href"
          @click="navigate(item.href)"
          :class="cn(
            'flex w-full items-center gap-3 rounded-md px-2.5 py-[7px] text-[13px] transition-all duration-200 group',
            route.path === item.href
              ? 'bg-[#eaf0ff] text-[#3841D8] font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )"
        >
          <component
            :is="item.icon"
            :class="cn(
              'h-[18px] w-[18px] shrink-0 transition-colors',
              route.path === item.href ? 'text-[#3841D8]' : 'text-muted-foreground/70 group-hover:text-foreground'
            )"
          />
          <span v-if="!collapsed" class="truncate">{{ item.title }}</span>
          <!-- Active indicator dot -->
          <div
            v-if="route.path === item.href && !collapsed"
            class="ml-auto h-1.5 w-1.5 rounded-full bg-[#3841D8]"
          />
        </button>
      </template>
    </nav>

    <!-- Collapse Button -->
    <div class="border-t border-sidebar-border p-2.5">
      <button
        @click="collapsed = !collapsed"
        :class="cn(
          'text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center rounded-md transition-all duration-200',
          collapsed ? 'w-full justify-center py-2' : 'w-full justify-center gap-2 py-1.5'
        )"
      >
        <ChevronLeftIcon :class="cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')" />
        <span v-if="!collapsed" class="text-xs font-medium">收起菜单</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.25s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}
</style>