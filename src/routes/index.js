import {
  createRouter,
  createWebHistory
} from 'vue-router'

/*
    mode： createWebHashHistory(#)(default)、createWebHistory、createMemoryHistory
 */
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return {
      top: 0
    }
  },
  routes: [{
    path: "",
    redirect: "/launch"
  }, {
    // 前台申请审批路由
    path: "/apply",
    name: "Apply",
    component: () => import('@/views/apply/index.vue'),
  }, {
    // 后台发起审批流程路由
    path: "/launch",
    name: "Launch",
    component: () => import('@/views/launch/index.vue'),
  }, {
    // 后台审批用户审批路由
    path: "/approve",
    name: "Approve",
    component: () => import('@/views/approve/index.vue'),
  }, {
    name: 'NotFound',
    path: '/:catchAll(.*)',
    component: () => import('@/views/error/index.vue'),
  }],
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    next();
    return;
  }
  next()
})

export default router;