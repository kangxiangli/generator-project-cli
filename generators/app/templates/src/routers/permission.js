/**
 * Created by ligang on 2018/6/7.
 */
export default {
  path: 'permission',
  name: 'permission',
  component: () => import('@/views/empty'),
  meta: { title: '权限', hidden: true, noRequireAuth: true, manageFree: true },
  children: [
    {
      path: '401',
      name: 'permission-401',
      component: () => import('@/views/permission/401.vue'),
      meta: { title: '401', noRequireAuth: true, outOfViews: true }
    },
    {
      path: '403',
      name: 'permission-403',
      component: () => import('@/views/permission/403.vue'),
      meta: { title: '403', noRequireAuth: true, outOfViews: true }
    },
    {
      path: '404',
      name: 'permission-404',
      component: () => import('@/views/permission/404.vue'),
      meta: { title: '404', noRequireAuth: true, outOfViews: true }
    },
    {
      path: '500',
      name: 'permission-500',
      component: () => import('@/views/permission/500.vue'),
      meta: { title: '500', noRequireAuth: true, outOfViews: true }
    }
  ]
}
