/**
 * Created by ligang on 2018/6/7.
 */
export default {
  path: 'user',
  name: 'user',
  component: () => import('@/views/empty'),
  meta: { title: '用户信息', hidden: true, manageFree: true },
  children: [
    {
      path: 'msg',
      name: 'user-msg',
      component: () => import('@/views/user/msg.vue'),
      meta: { title: '消息中心' }
    },
    {
      path: 'download-center',
      name: 'user-download-center',
      component: () => import('@/views/user/download-center.vue'),
      meta: { title: '下载中心', noCache: true }
    }
  ]
}
