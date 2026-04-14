import keys from 'lodash/keys';
import { defineStore } from 'pinia';
import { Color } from 'tvision-color';
import { computed, ref } from 'vue';

import type { TColorSeries } from '@/config/color';
import { DARK_CHART_COLORS, LIGHT_CHART_COLORS } from '@/config/color';
import STYLE_CONFIG from '@/config/style';
import { store } from '@/store';
import type { ModeType } from '@/types/interface';
import { generateColorMap, insertThemeStylesheet } from '@/utils/color';

export type TState = typeof STYLE_CONFIG & {
  showSettingPanel: boolean;
  colorList: TColorSeries;
  chartColors: typeof LIGHT_CHART_COLORS;
};
export type TStateKey = keyof TState;

export const useSettingStore = defineStore(
  'setting',
  () => {
    // State - individual refs for each property for proper TypeScript support
    const showFooter = ref(STYLE_CONFIG.showFooter);
    const isSidebarCompact = ref(STYLE_CONFIG.isSidebarCompact);
    const showBreadcrumb = ref(STYLE_CONFIG.showBreadcrumb);
    const menuAutoCollapsed = ref(STYLE_CONFIG.menuAutoCollapsed);
    const mode = ref(STYLE_CONFIG.mode);
    const layout = ref(STYLE_CONFIG.layout);
    const splitMenu = ref(STYLE_CONFIG.splitMenu);
    const sideMode = ref(STYLE_CONFIG.sideMode);
    const isFooterAside = ref(STYLE_CONFIG.isFooterAside);
    const isSidebarFixed = ref(STYLE_CONFIG.isSidebarFixed);
    const isHeaderFixed = ref(STYLE_CONFIG.isHeaderFixed);
    const isUseTabsRouter = ref(STYLE_CONFIG.isUseTabsRouter);
    const showHeader = ref(STYLE_CONFIG.showHeader);
    const brandTheme = ref(STYLE_CONFIG.brandTheme);
    const showSettingPanel = ref(false);
    const colorList = ref<TColorSeries>({});
    const chartColors = ref(LIGHT_CHART_COLORS);

    // Getters
    const showSidebar = computed(() => layout.value !== 'top');

    const showSidebarLogo = computed(() => layout.value === 'side');

    const showHeaderLogo = computed(() => layout.value !== 'side');

    const displayMode = computed(() => {
      if (mode.value === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)');
        if (media.matches) {
          return 'dark';
        }
        return 'light';
      }
      return mode.value as ModeType;
    });

    const displaySideMode = computed((): ModeType => {
      return sideMode.value as ModeType;
    });

    // Helper actions
    const changeMode = async (modeValue: ModeType | 'auto') => {
      let theme = modeValue;

      if (modeValue === 'auto') {
        theme = getMediaColor();
      }
      const isDarkMode = theme === 'dark';

      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');

      chartColors.value = isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
    };

    const changeSideMode = async (modeValue: ModeType) => {
      const isDarkMode = modeValue === 'dark';

      document.documentElement.setAttribute('side-mode', isDarkMode ? 'dark' : '');
    };

    const getMediaColor = () => {
      const media = window.matchMedia('(prefers-color-scheme:dark)');

      if (media.matches) {
        return 'dark';
      }
      return 'light';
    };

    const changeBrandTheme = (brandThemeValue: string) => {
      const currentMode = displayMode.value;
      // 以主题色加显示模式作为键
      const colorKey = `${brandThemeValue}[${currentMode}]`;
      let colorMap = colorList.value[colorKey];
      // 如果不存在色阶，就需要计算
      if (colorMap === undefined) {
        const [{ colors: newPalette, primary: brandColorIndex }] = Color.getColorGradations({
          colors: [brandThemeValue],
          step: 10,
          remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
        });
        colorMap = generateColorMap(brandThemeValue, newPalette, currentMode, brandColorIndex);
        colorList.value[colorKey] = colorMap;
      }
      // TODO 需要解决不停切换时有反复插入 style 的问题
      insertThemeStylesheet(brandThemeValue, colorMap, currentMode);
      document.documentElement.setAttribute('theme-color', brandThemeValue);
    };

    // Actions
    const updateConfig = (payload: Partial<TState>) => {
      for (const key in payload) {
        const k = key as TStateKey;
        const val = payload[k];
        if (val === undefined) continue;

        if (k === 'showFooter') {
          showFooter.value = val as boolean;
        } else if (k === 'isSidebarCompact') {
          isSidebarCompact.value = val as boolean;
        } else if (k === 'showBreadcrumb') {
          showBreadcrumb.value = val as boolean;
        } else if (k === 'menuAutoCollapsed') {
          menuAutoCollapsed.value = val as boolean;
        } else if (k === 'mode') {
          mode.value = val as string;
          changeMode(val as ModeType);
        } else if (k === 'layout') {
          layout.value = val as string;
        } else if (k === 'splitMenu') {
          splitMenu.value = val as boolean;
        } else if (k === 'sideMode') {
          sideMode.value = val as string;
          changeSideMode(val as ModeType);
        } else if (k === 'isFooterAside') {
          isFooterAside.value = val as boolean;
        } else if (k === 'isSidebarFixed') {
          isSidebarFixed.value = val as boolean;
        } else if (k === 'isHeaderFixed') {
          isHeaderFixed.value = val as boolean;
        } else if (k === 'isUseTabsRouter') {
          isUseTabsRouter.value = val as boolean;
        } else if (k === 'showHeader') {
          showHeader.value = val as boolean;
        } else if (k === 'brandTheme') {
          brandTheme.value = val as string;
          changeBrandTheme(val as string);
        } else if (k === 'showSettingPanel') {
          showSettingPanel.value = val as boolean;
        } else if (k === 'colorList') {
          colorList.value = val as TColorSeries;
        } else if (k === 'chartColors') {
          chartColors.value = val as typeof LIGHT_CHART_COLORS;
        }
      }
    };

    return {
      // State
      showFooter,
      isSidebarCompact,
      showBreadcrumb,
      menuAutoCollapsed,
      mode,
      layout,
      splitMenu,
      sideMode,
      isFooterAside,
      isSidebarFixed,
      isHeaderFixed,
      isUseTabsRouter,
      showHeader,
      brandTheme,
      showSettingPanel,
      colorList,
      chartColors,
      // Getters
      showSidebar,
      showSidebarLogo,
      showHeaderLogo,
      displayMode,
      displaySideMode,
      // Actions
      updateConfig,
      changeMode,
      changeSideMode,
      getMediaColor,
      changeBrandTheme,
    };
  },
  {
    persist: [
      {
        key: 'setting',
        paths: [...keys(STYLE_CONFIG), 'colorList', 'chartColors'],
      },
    ] as any,
  },
);

export function getSettingStore() {
  return useSettingStore(store);
}
