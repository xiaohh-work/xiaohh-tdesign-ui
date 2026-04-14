import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { store } from '@/store';
import type { TRouterInfo } from '@/types/interface';

const homeRoute: Array<TRouterInfo> = [
  {
    path: '/dashboard/base',
    routeIdx: 0,
    title: '仪表盘',
    name: 'DashboardBase',
    isHome: true,
  },
];

const initialState = {
  tabRouterList: homeRoute,
  isRefreshing: false,
};

// 不需要做多标签tabs页缓存的列表 值为每个页面对应的name 如 DashboardDetail
// const ignoreCacheRoutes = ['DashboardDetail'];
const ignoreCacheRoutes = ['login'];

export const useTabsRouterStore = defineStore(
  'tabsRouter',
  () => {
    // State
    const tabRouterList = ref<Array<TRouterInfo>>(initialState.tabRouterList);
    const isRefreshing = ref<boolean>(initialState.isRefreshing);

    // Getters
    const tabRouters = computed(() => tabRouterList.value);
    const refreshing = computed(() => isRefreshing.value);

    // Actions
    const toggleTabRouterAlive = (routeIdx: number) => {
      isRefreshing.value = !isRefreshing.value;
      tabRouters.value[routeIdx].isAlive = !tabRouters.value[routeIdx].isAlive;
    };

    const appendTabRouterList = (newRoute: TRouterInfo) => {
      // 不要将判断条件newRoute.meta.keepAlive !== false修改为newRoute.meta.keepAlive，starter默认开启保活，所以meta.keepAlive未定义时也需要进行保活，只有显式说明false才禁用保活。
      const needAlive = !ignoreCacheRoutes.includes(newRoute.name as string) && newRoute.meta?.keepAlive !== false;
      if (!tabRouters.value.some((route: TRouterInfo) => route.path === newRoute.path)) {
        tabRouterList.value = tabRouterList.value.concat({ ...newRoute, isAlive: needAlive });
      }
    };

    const subtractCurrentTabRouter = (newRoute: TRouterInfo) => {
      const { routeIdx } = newRoute;
      if (routeIdx === undefined) return;
      tabRouterList.value = tabRouterList.value.slice(0, routeIdx).concat(tabRouterList.value.slice(routeIdx + 1));
    };

    const subtractTabRouterBehind = (newRoute: TRouterInfo) => {
      const { routeIdx } = newRoute;
      if (routeIdx === undefined) return;
      const homeIdx: number = tabRouters.value.findIndex((route: TRouterInfo) => route.isHome);
      let newTabRouterList: Array<TRouterInfo> = tabRouterList.value.slice(0, routeIdx + 1);
      if (routeIdx < homeIdx) {
        newTabRouterList = newTabRouterList.concat(homeRoute);
      }
      tabRouterList.value = newTabRouterList;
    };

    const subtractTabRouterAhead = (newRoute: TRouterInfo) => {
      const { routeIdx } = newRoute;
      if (routeIdx === undefined) return;
      const homeIdx: number = tabRouters.value.findIndex((route: TRouterInfo) => route.isHome);
      let newTabRouterList: Array<TRouterInfo> = tabRouterList.value.slice(routeIdx);
      if (routeIdx > homeIdx) {
        newTabRouterList = homeRoute.concat(newTabRouterList);
      }
      tabRouterList.value = newTabRouterList;
    };

    const subtractTabRouterOther = (newRoute: TRouterInfo) => {
      const { routeIdx } = newRoute;
      if (routeIdx === undefined) return;
      const homeIdx: number = tabRouters.value.findIndex((route: TRouterInfo) => route.isHome);
      tabRouterList.value = routeIdx === homeIdx ? homeRoute : homeRoute.concat([tabRouterList.value?.[routeIdx]]);
    };

    const removeTabRouterList = () => {
      tabRouterList.value = [];
    };

    const initTabRouterList = (newRoutes: TRouterInfo[]) => {
      newRoutes?.forEach((route: TRouterInfo) => appendTabRouterList(route));
    };

    return {
      // State
      tabRouterList,
      isRefreshing,
      // Getters
      tabRouters,
      refreshing,
      // Actions
      toggleTabRouterAlive,
      appendTabRouterList,
      subtractCurrentTabRouter,
      subtractTabRouterBehind,
      subtractTabRouterAhead,
      subtractTabRouterOther,
      removeTabRouterList,
      initTabRouterList,
    };
  },
  {
    persist: true,
  },
);

export function getTabsRouterStore() {
  return useTabsRouterStore(store);
}
