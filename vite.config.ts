import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import compression from 'vite-plugin-compression';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      rollupOptions: {
        // [name]
        output: {
          // 代码块文件名
          chunkFileNames: 'assets/js/xiaohh-[hash].js',
          // 入口文件名
          entryFileNames: 'assets/xiaohh-[hash].js',
          assetFileNames(assetInfo) {
            // 文件名
            const fileName = assetInfo.names[0];
            if (fileName.endsWith('.svg') || fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
              // 判断如果是 svg, png, jpg 等图片文件，则放入 assets/img 文件夹当中
              return 'assets/img/xiaohh-[hash].[ext]';
            } else if (fileName.endsWith('.css')) {
              // 如果是 css 文件，则放入 assets/css 文件夹当中
              return 'assets/css/xiaohh-[hash].[ext]';
            } else {
              // 如果是其他文件，则直接放入 assets 文件夹当中
              return 'assets/xiaohh-[hash].[ext]';
            }
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // node_modules 当中不同依赖打包成不同的文件
              return id.split('node_modules/')[1].split('/')[0];
            } else if (id.endsWith('.svg')) {
              // 如果是 svg 文件打包成 js 文件，则每个 svg 文件单独一个 js 文件
              return (
                id
                  .split('/')
                  .pop()
                  ?.replace(/\.svg$/i, '') || ''
              );
            }
          },
        },
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
      svgLoader(),
      compression({
        algorithm: 'gzip', // 压缩算法
        filter: /\.(html|js|css|json|txt|ico|svg|png)(\?.*)?$/i, // 需要压缩的文件
        ext: '.gz', // 压缩后缀
        threshold: 512, // 大于 0.5KB 的文件将会被压缩
        deleteOriginFile: false, // 压缩后删除对应的源文件
        compressionOptions: {
          level: 9, // 压缩级别，1~9，压缩级别（数值）越高，压缩的越狠
        },
      }),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        [VITE_API_URL_PREFIX]: 'http://127.0.0.1:3000/',
      },
    },
  };
};
