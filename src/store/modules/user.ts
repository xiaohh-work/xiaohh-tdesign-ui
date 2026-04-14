import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const token = ref('main_token'); // 默认token不走权限
    const userInfo = ref<UserInfo>({ ...InitUserInfo });

    // Getters
    const roles = computed(() => {
      return userInfo.value?.roles;
    });

    // Actions
    const login = async (userInfoData: Record<string, unknown>) => {
      const mockLogin = async (userInfo: Record<string, unknown>) => {
        // 登录请求流程
        console.log(`用户信息:`, userInfo);
        // const { account, password } = userInfo;
        // if (account !== 'td') {
        //   return {
        //     code: 401,
        //     message: '账号不存在',
        //   };
        // }
        // if (['main_', 'dev_'].indexOf(password) === -1) {
        //   return {
        //     code: 401,
        //     message: '密码错误',
        //   };
        // }
        // const token = {
        //   main_: 'main_token',
        //   dev_: 'dev_token',
        // }[password];
        return {
          code: 200,
          message: '登录成功',
          data: 'main_token',
        };
      };

      const res = await mockLogin(userInfoData);
      if (res.code === 200) {
        token.value = res.data;
      } else {
        throw res;
      }
    };

    const getUserInfo = async () => {
      const mockRemoteUserInfo = async (tokenValue: string) => {
        if (tokenValue === 'main_token') {
          return {
            name: 'Tencent',
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(token.value);

      userInfo.value = res;
    };

    const logout = async () => {
      token.value = '';
      userInfo.value = { ...InitUserInfo };
    };

    return {
      // State
      token,
      userInfo,
      // Getters
      roles,
      // Actions
      login,
      getUserInfo,
      logout,
    };
  },
  {
    persist: [
      {
        key: 'user',
        paths: ['token'],
        afterRestore: () => {
          const permissionStore = usePermissionStore();
          permissionStore.initRoutes?.();
        },
      },
    ] as any,
  },
);
