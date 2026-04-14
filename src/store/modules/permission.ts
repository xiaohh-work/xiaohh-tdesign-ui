import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import type { RouteItem } from '@/api/model/permissionModel';
import { getMenuList } from '@/api/permission';
import router, { fixedRouterList, homepageRouterList } from '@/router';
import { store } from '@/store';
import { transformObjectToRoute } from '@/utils/route';

export const usePermissionStore = defineStore('permission', () => {
  // State
  const whiteListRouters = ref<string[]>(['/login']);
  const routers = ref<RouteRecordRaw[]>([]);
  const removeRoutes = ref<RouteRecordRaw[]>([]);
  const asyncRoutes = ref<RouteRecordRaw[]>([]);

  // Actions
  const initRoutes = async () => {
    const accessedRouters = asyncRoutes.value;

    // 在菜单展示全部路由
    routers.value = [...homepageRouterList, ...accessedRouters, ...fixedRouterList];
    // 在菜单只展示动态路由和首页
    // routers.value = [...homepageRouterList, ...accessedRouters];
    // 在菜单只展示动态路由
    // routers.value = [...accessedRouters];
  };

  const buildAsyncRoutes = async () => {
    try {
      // 发起菜单权限请求 获取菜单列表
      const menuList: Array<RouteItem> = (await getMenuList()).list;
      asyncRoutes.value = transformObjectToRoute(menuList);
      await initRoutes();
      return asyncRoutes.value;
    } catch (error) {
      throw new Error(`Can't build routes: ${error}`);
    }
  };

  const restoreRoutes = async () => {
    // 不需要在此额外调用initRoutes更新侧边导肮内容，在登录后asyncRoutes为空会调用
    asyncRoutes.value.forEach((item: RouteRecordRaw) => {
      if (item.name) {
        router.removeRoute(item.name);
      }
    });
    asyncRoutes.value = [];
  };

  return {
    // State
    whiteListRouters,
    routers,
    removeRoutes,
    asyncRoutes,
    // Actions
    initRoutes,
    buildAsyncRoutes,
    restoreRoutes,
  };
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
