// 前端 roles 控制菜单权限 通过登录后的角色对菜单就行过滤处理
// 如果需要前端 roles 控制菜单权限 请使用此文件代码替换 permission.ts 的内容
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import router, { allRoutes } from '@/router';
import { store } from '@/store';

function filterPermissionsRouters(routes: Array<RouteRecordRaw>, roles: Array<unknown>) {
  const res: Array<RouteRecordRaw> = [];
  const removeRoutes: Array<RouteRecordRaw> = [];
  routes.forEach((route) => {
    const children: Array<RouteRecordRaw> = [];
    route.children?.forEach((childRouter) => {
      const roleCode = childRouter.meta?.roleCode || childRouter.name;
      if (roles.includes(roleCode)) {
        children.push(childRouter);
      } else {
        removeRoutes.push(childRouter);
      }
    });
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  return { accessedRouters: res, removeRoutes };
}

export const usePermissionStore = defineStore('permission', () => {
  // State
  const whiteListRouters = ref<string[]>(['/login']);
  const routers = ref<RouteRecordRaw[]>([]);
  const removeRoutes = ref<RouteRecordRaw[]>([]);

  // Actions
  const initRoutes = async (roles: Array<unknown>) => {
    let accessedRouters: RouteRecordRaw[] = [];

    let routersToRemove: Array<RouteRecordRaw> = [];
    // special token
    if (roles.includes('all')) {
      accessedRouters = allRoutes;
    } else {
      const res = filterPermissionsRouters(allRoutes, roles);
      accessedRouters = res.accessedRouters;
      routersToRemove = res.removeRoutes;
    }

    routers.value = accessedRouters;
    removeRoutes.value = routersToRemove;

    routersToRemove.forEach((item: RouteRecordRaw) => {
      if (item.name && router.hasRoute(item.name)) {
        router.removeRoute(item.name);
      }
    });
  };

  const restore = async () => {
    removeRoutes.value.forEach((item: RouteRecordRaw) => {
      router.addRoute(item);
    });
  };

  return {
    // State
    whiteListRouters,
    routers,
    removeRoutes,
    // Actions
    initRoutes,
    restore,
  };
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
