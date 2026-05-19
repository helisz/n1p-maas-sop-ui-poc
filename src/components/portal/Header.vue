<!-- [AI_START TIMESTAMP=2025-06-20 06:30:00] -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { BellIcon, QuestionMarkCircleIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

function handleLogout() {
  auth.logout();
  router.push('/');
}

const initials = auth.user?.name?.charAt(0) ?? '管';
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b  border-[#e8e9f0]/60 px-6 text-white">
    <div class="flex items-center gap-2">
      <slot name="logo" />
    </div>

    <div class="flex items-center gap-2">
      <!-- Notifications -->
      <Button variant="ghost" size="icon" class="relative h-8 w-8">
        <BellIcon class="h-[18px] w-[18px] text-muted-foreground" />
        <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#3841D8] ring-2 ring-background" />
      </Button>

      <!-- Help -->
      <Button variant="ghost" size="icon" class="hidden sm:flex h-8 w-8">
        <QuestionMarkCircleIcon class="h-[18px] w-[18px] text-muted-foreground" />
      </Button>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" class="flex items-center gap-2 px-2 text-white hover:bg-white/10 hover:text-white">
            <Avatar size="sm">
              <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="头像" class="h-full w-full rounded-full object-cover" />
              <AvatarFallback v-else class="bg-[#eaf0ff] text-[#3841D8] text-xs font-semibold">
                {{ initials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex flex-col items-start text-xs">
              <span class="font-medium text-foreground">{{ auth.user?.name ?? '运营管理员' }}</span>
              <span class="text-muted-foreground text-[11px]">{{ auth.user?.role ?? '管理员' }}</span>
            </div>
             <ChevronDownIcon class="text-muted-foreground h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <div class="px-2 py-1.5">
            <p class="text-foreground text-xs font-medium">
              {{ auth.user?.name }}
            </p>
            <p class="text-muted-foreground truncate text-xs">
              {{ auth.user?.email ?? '' }}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="router.push('/profile')">
            <UserIcon class="mr-2 h-4 w-4" />
            <span>个人中心</span>
          </DropdownMenuItem>
          <DropdownMenuItem @click="router.push('/profile')">
            <Cog6ToothIcon class="mr-2 h-4 w-4" />
            <span>账号设置</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
            <ArrowRightStartOnRectangleIcon class="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
<!-- [AI_END LINES=80 TIMESTAMP=2025-06-20 06:30:00] -->
