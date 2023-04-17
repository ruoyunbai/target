# 配置
 1. 
   - cnpm@7.1.0
   - node@17.8.0
2. 
   - cnpm install
   - npm run dev

# 打包
``` bash
npm install electron-packager -g
electron-packager .
```
# vite+electron配置教程（已完成
https://blog.csdn.net/weixin_47551643/article/details/128000357#:~:text=%E5%B0%86%E7%8E%B0%E6%9C%89%E7%9A%84%20vite%20%E9%A1%B9%E7%9B%AE%E6%89%93%E5%8C%85%E4%B8%BAelectron%EF%BC%8C%E9%80%82%E7%94%A8%E4%BA%8E%E5%B7%B2%E5%BC%80%E5%8F%91%E8%BF%87%E4%B8%80%E6%AE%B5%E6%97%B6%E9%97%B4%E7%9A%84vite%E9%A1%B9%E7%9B%AE%E3%80%82%20%E5%A6%82%E6%9E%9C%E6%98%AF%E4%BB%8E%E9%9B%B6%E6%90%AD%E5%BB%BAvite%2Belectron%E9%A1%B9%E7%9B%AE%EF%BC%8C%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8,electron-vite-vue%20%EF%BC%8C%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E5%88%9B%E5%BB%BA%E5%B7%B2%E9%9B%86%E6%88%90%E5%A5%BD%20electron%20%E7%9A%84vite%E9%A1%B9%E7%9B%AE%201.

推荐使用cnpm，npm很慢
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
