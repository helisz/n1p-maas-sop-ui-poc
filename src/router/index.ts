import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { routes } from 'vue-router/auto-routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  // 1. Redirect to the unauthenticated login path safely using path notation
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ path: '/login' });
  }
  // 2. Intercept authenticated users trying to hit the login gate and bounce them to dashboard
  else if (!to.meta.requiresAuth && auth.isLoggedIn && to.path === '/login') {
    next({ path: '/dashboard' });
  } else {
    next();
  }
});

export default router;
