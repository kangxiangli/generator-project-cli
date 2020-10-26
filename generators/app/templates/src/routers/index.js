import Vue from 'vue'
// 在 vue-router 基础上增加扩展方法
import Router from '@components/lib/plugins/router-extend'
import store from '@/store'
import { request } from '@/custom/plugins/request.js'

// import analysis from '@/routers/analysis.js'
// import handle from '@/routers/handle.js'
// import operation from '@/routers/operation.js'
// import event from '@/routers/event.js'
import manage from '@/routers/manage.js'
// import situation from '@/routers/situation.js'
import user from '@/routers/user.js'
import demo from '@/routers/demo.js'
// import permission from '@/router/permission.js'
// import disposal from '@/router/disposal.js'
import Message from 'element-ui/packages/message/index.js'

// @FIXME 重写 push 方法，增加 catch 捕获异常，目前无最优解决方案 参考: https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const ORIGINAL_PUSH = Router.prototype.push
Router.prototype.push = function (location, onResolve, onReject) {
  if (onResolve || onReject) return ORIGINAL_PUSH.call(this, location, onResolve, onReject)
  return ORIGINAL_PUSH.call(this, location).catch(err => err)
}

Vue.use(Router)
let isRouterPush = false
// let routers = [situation, event, analysis, disposal, operation, manage, user, permission]
let routers = [manage, user, demo]

// 根据路由配置生成菜单，路由发生变化后请放开此行注释，具体操作请查看 README !!!
// require('./generateMenus.js').default(routers)

/**
 * 将层级路由变为以为数组形式，便于keep-alive处理
 */
let zipRouterAry = []

function zipRouter (menu, parentPath) {
  // 不存在 || length为0
  if (!menu.children || !menu.children.length) {
    menu.path = `${parentPath}/${menu.path}`.replace(/\/+/g, '/')
    zipRouterAry.push(menu)
  } else {
    menu.children.forEach(item => {
      return zipRouter(item, `${parentPath}/${menu.path}`)
    })
  }
}

const router = new Router({
  mode: 'history',
  // 路由跳转后将top值设置为0
  // scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import('@/views/logins/login.vue'),
    meta: { noRequireAuth: true }
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: () => import('@/views/logins/password-reset.vue'),
    meta: { noRequireAuth: true }
  },
  {
    path: '/redirect', // 其他系统通过此路由免密进入系统路由
    name: 'redirect',
    component: () => import('@/views/redirect/redirect.vue'),
    meta: { noRequireAuth: true }
  }]
})

/**
 * 主要用来拦截路由的钩子
 * @param to Route: 即将要进入的目标 路由对象
 * @param from: Route: 当前导航正要离开的路由
 * @param next: Function: 一定要调用该方法来 resolve 这个钩子
 */
router.beforeEach(async (to, from, next) => {
  // debugger
  // 1.不需要权限的路由直接放行
  // 2.没有token或者token过期的情况，直接拒到登录页
  if (to.meta.noRequireAuth) {
    return next()
  } else if (!store.getters['base/token$$']) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  // 路由权限，首次进入会根据路由权限添加路由树
  if (!isRouterPush) {
    isRouterPush = true
    let routersPermission = []
    let permission = {}
    try {
      // 请求权限
      let menus = await request({
        url: '/api/sys/menus'
      })
      if (menus) {
        routersPermission = menus.routers || []
        permission = menus.permission || {}
      }
    } catch (e) {
      isRouterPush = false
      Message({
        type: 'error',
        message: '菜单权限获取失败，建议稍后尝试重新登录。'
      })
      return next(false)
    }
    store.commit('permission/SET_PERMISSION', permission)
    // 根据权限合并生成新的路由树
    const newRouters = mergeRouter(routers, routersPermission)
    // 拍路由扁平化处理
    newRouters.forEach(menu => zipRouter(menu, ''))
    // 更新菜单中依赖的数据
    store.commit('permission/SET_MENU_LIST', newRouters)
    // 404 页面
    zipRouterAry.push({
      path: '*',
      name: 'permission-404',
      component: () => import('@/views/permission/404.vue'),
      meta: { noRequireAuth: true, title: '没有权限' }
    })
    let defaultRouter = zipRouterAry.find(item => item.meta && !item.meta.hidden)
    // 动态添加符合权限的路由 @FIXME 此处动态添加可优化，考虑全部挂载后，只在此处判断路由是否有权限
    router.addRoutes([{
      path: '/',
      name: 'index',
      component: () => import('@/views/layouts/layout.vue'),
      // 默认跳转到第一个页面。
      redirect: { name: defaultRouter.name },
      children: zipRouterAry
    }])

    if (!routersPermission.length) {
      isRouterPush = false
      return next({
        name: 'permission-404'
      })
    }
    // 如果是根路径，默认跳到路由中的第一个
    if (to.path === '/') {
      // 使用path的话 当第一个路由的路径是/:id这种形式时 第一次进入页面时会直接在浏览器url上显示出 /:id，这里所以使用name
      return next({ name: defaultRouter.name, query: to.query })
    }
    next(to)
  }

  // 判断外部链接
  if (to.meta.external) {
    const url = store.state.base.globalConfig[to.meta.external]
    if (url) {
      window.open(url)
    } else {
      Message({
        type: 'error',
        message: '暂无该链接的配置（请在前端config.js文件中进行配置）。'
      })
    }
    // 中断路由
    return next(false)
  }

  // 判断当前路由不存在query 值，自动添加query，用于添加多标签路由
  if (!to.query._r) {
    // 是否需要限制tab数量
    // 判断是否超出tab最大数,如果_maxCacheLimit为false，则表示不限制tab数量
    let _maxCacheLimit = store.getters['base/globalConfig$$']('TAGS_VIEW')['maxNum']
    if (typeof _maxCacheLimit === 'number' && store.state.tagsView.visitedViews.length >= _maxCacheLimit) {
      Message({
        type: 'error',
        message: `超出最大tab数量${_maxCacheLimit}限制`
      })
      next(false)
    } else {
      // 添加query，用于添加多标签路由
      to.query._r = `${+new Date()}`
      next({ path: to.path, query: { ...to.query, _r: to.query._r } })
    }
  } else {
    next()
  }
})

/**
 * 根据后台路由权限树，从原有的路由树中摘下对应的配置。
 * 会对每个路由的 meta 与 权限中的 meta 进行合并(权限中的优先级高)
 * @param {*} originRoutes
 * @param {*} configRoutes
 */
function mergeRouter (originRoutes, configRoutes) {
  // 开发模式下 路由不走权限管理的机制
  // if (process.env.NODE_ENV === 'development') {
  //   return originRoutes
  // }
  // 将两颗路由树转换为 key value 的对象形式
  const originRoutesMap = {} // 原路由
  const configRoutesMap = {} // 配置权限路由
  originRoutes.forEach(val => {
    originRoutesMap[val.name] = val
  })
  configRoutes.forEach(val => {
    configRoutesMap[val.name] = val
  })

  const routers = []
  // 迭代 originRoutes
  for (const k in originRoutesMap) {
    const meta = originRoutesMap[k].meta || {}
    if (meta.noRequireAuth || meta.manageFree) {
      // noRequireAuth 不受后台权限限制的路由
      routers.push(originRoutesMap[k])
      continue
    }
    // 如果配置中也有这个 key，说明拥有该模块的权限
    if (configRoutesMap[k]) {
      const orRouter = originRoutesMap[k] // 原路由
      const coRouter = configRoutesMap[k] // 配置权限路由
      let router = { ...orRouter }
      // 合并 meat 数据，后台可以在配置中修改 meta 属性，所以要以后台的优先级为高
      router.meta = Object.assign({}, router.meta, coRouter.meta)
      if (orRouter.children && coRouter.children) {
        router.children = mergeRouter(orRouter.children, coRouter.children)
      }
      routers.push(router)
    }
  }
  return routers
}

export default router
