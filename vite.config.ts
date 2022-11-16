import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const resolve = (dir) => path.resolve(__dirname, dir);



// https://vitejs.dev/config/
export default(({mode}) =>{
  const VITE_BASE_URL: string = loadEnv(mode, process.cwd()).VITE_BASE_URL;
  const VITE_BASE_SERVER: string = loadEnv(mode, process.cwd(), '').VITE_BASE_SERVER;
  return defineConfig({
    plugins: [vue(),
      createSvgIconsPlugin({
        //  指定需要缓存的图标文件夹
          iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
          symbolId: 'icon-[name]',
        }),],
        server: {
          host: '0.0.0.0',
          port: 9999,
          // 是否开启 https
          https: false,
          proxy: {
            VITE_BASE_URL: {
              // 后台地址
              target: VITE_BASE_SERVER,
              changeOrigin: true,
              //rewrite: path => path.replace(/^\/api/, '')
            }
          },
        },
        
        base: './',
        resolve: {
          alias: {
            '@': resolve('src'),//作为 entries 的选项
          },
          extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },
  
    build: {
      minify: 'terser',
      // 服务端渲染
      ssr: false,
      outDir: 'dist',
      chunkSizeWarningLimit: 10000,
      emptyOutDir: true,
      rollupOptions: {
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
        //   }
        // },
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
      commonjsOptions: {
        requireReturnsDefault: 'namespace'
      },
    },
  
    // ...
    define: {
      'process.env': {}
    },  
  })
  
})
