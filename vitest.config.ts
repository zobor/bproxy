/*
 * @Date: 2022-08-13 18:08:38
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 18:08:40
 * @FilePath: /bp/vitest.config.ts
 */
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, './src/web'],
  },
})
