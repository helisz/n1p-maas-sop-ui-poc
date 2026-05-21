// [AI_START TIMESTAMP=2025-06-20 06:30:00]
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import { routes } from 'vue-router/auto-routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'Login' });
  } else if (!to.meta.requiresAuth && auth.isLoggedIn && to.name === 'Login') {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
// [AI_END LINES=71 TIMESTAMP=2025-06-20 06:30:00]
