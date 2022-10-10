多环境配置：
npm run dev 使用.env.dev文件配置运行
npm run build 使用.env.pro打包
至于test环境 随意
package.json配置启动命令所有示例如下：
"scripts": {
    "serve": "vite",   // 未指定模式的默认取 .env.development 文件中的配置
    "dev": "vite --mode dev",   // 取 .env.dev文件中的配置
    "stg": "vite --mode stg",  // 取 .env.stg文件中的配置
    "pro": "vite --mode pro",   // 取 .env.pro文件中的配置
    "build": "vue-tsc --noEmit && vite build",    // 未指定模式的默认取 .env.development 文件中的配置
    "build:dev": "vue-tsc --noEmit && vite build --mode dev",    // build的时候取dev的配置
    "build:stg": "vue-tsc --noEmit && vite build --mode stg",      // build的时候取stg的配置
    "build:pro": "vue-tsc --noEmit && vite build --mode pro", 	// build的时候取pro的配置
    "preview": "vite preview"
  },

