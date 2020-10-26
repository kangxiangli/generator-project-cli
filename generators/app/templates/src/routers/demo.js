/*
 * @Author: guozp
 * @Date: 2020-07-24 11:18:05
 * @LastEditTime: 2020-07-24 11:25:02
 * @LastEditors: guozp
 * @Description: Do not edit
 * @FilePath: /argus-fe-template/src/routers/demo.js
 */
export default {
  path: 'demo',
  name: 'demo',
  component: () => import('@/views/empty'),
  icon: 'management',
  meta: { title: 'Demo', noRequireAuth: true, manageFree: true },
  children: [
    {
      path: 'iframe',
      name: 'iframe',
      component: () => import('@/views/demo/iframe/iframe.vue'),
      meta: {
        title: 'iframe测试'
      }
    }
  ]
}
