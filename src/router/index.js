import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/list',
    name: '博客管理',
    meta: {
      title: '博客管理',
      icon: 'el-icon-notebook-1',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/blog/create'),
        name: '写文章',
        meta: { title: '写文章', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'list',
        component: () => import('@/views/blog/list'),
        name: '文章列表',
        meta: { title: '文章列表', icon: 'education', roles: ['admin'] }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/blog/edit'),
        name: '编辑文章',
        meta: { title: '编辑文章', noCache: true, activeMenu: '/blog/list', roles: ['admin'] },
        hidden: true
      },
      {
        path: 'category',
        component: () => import('@/views/blog/category'),
        name: '类别管理',
        meta: { title: '类别管理', icon: 'list', roles: ['admin'] }
      },
      {
        path: 'banner',
        component: () => import('@/views/blog/banner'),
        name: '轮播图管理',
        meta: { title: '轮播图管理', icon: 'el-icon-picture', roles: ['admin'] }
      },
      {
        path: 'visitor',
        component: () => import('@/views/blog/visitor'),
        name: '访客统计',
        meta: { title: '访客统计', icon: 'peoples', roles: ['admin'] }
      }
    ]
  },
  // {
  //   path: '/qdllblog',
  //   component: Layout,
  //   redirect: '/blogqdll/list',
  //   name: '勤德莱莱博客管理',
  //   meta: {
  //     title: '勤德莱莱博客管理',
  //     icon: 'el-icon-notebook-1',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/blog-qd/create'),
  //       name: '写文章',
  //       meta: { title: '写文章', icon: 'edit', roles: ['admin'] }
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/blog-qd/list'),
  //       name: '文章列表',
  //       meta: { title: '文章列表', icon: 'education', roles: ['admin'] }
  //     },
  //     {
  //       path: 'edit/:id',
  //       component: () => import('@/views/blog-qd/edit'),
  //       name: '编辑文章',
  //       meta: { title: '编辑文章', noCache: true, activeMenu: '/blogqdll/list', roles: ['admin'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'category',
  //       component: () => import('@/views/blog-qd/category'),
  //       name: '类别管理',
  //       meta: { title: '类别管理', icon: 'list', roles: ['admin'] }
  //     }
  //   ]
  // },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/list',
    name: '任务管理',
    meta: {
      title: '任务管理',
      icon: 'el-icon-s-platform',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/task/emaillist'),
        name: '定时邮件任务',
        meta: { title: '定时邮件任务', icon: 'email', roles: ['admin', 'guest'] }
      },
      {
        path: 'weather',
        component: () => import('@/views/task/weatherEmail'),
        name: '每日天气邮件',
        meta: { title: '每日天气邮件', icon: 'el-icon-sunrise', roles: ['admin', 'guest'] }
      },
      {
        path: 'note',
        component: () => import('@/views/task/note'),
        name: '备忘录',
        meta: { title: '备忘录', icon: 'el-icon-document-add', roles: ['admin', 'guest'] }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/blog/list',
    name: '资源管理',
    meta: {
      title: '资源管理',
      icon: 'el-icon-folder-checked',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/resource/create'),
        name: '上传资源',
        meta: { title: '上传资源', icon: 'el-icon-document-add', roles: ['admin', 'guest'] }
      },
      {
        path: 'create_url',
        component: () => import('@/views/resource/create_url'),
        name: '上传资源(url)',
        meta: { title: '上传资源(url)', icon: 'el-icon-document-add', roles: ['admin', 'guest'] }
      },
      {
        path: 'list',
        component: () => import('@/views/resource/list'),
        name: '资源列表',
        meta: { title: '资源列表', icon: 'el-icon-document-copy', roles: ['admin', 'guest'] }
      },
      {
        path: 'site',
        component: () => import('@/views/resource/site'),
        name: '网站收藏',
        meta: { title: '网站收藏', icon: 'el-icon-link', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/djjl',
    component: Layout,
    redirect: '/djjl/player',
    name: '电竞经理',
    meta: {
      title: '电竞经理',
      icon: 'el-icon-orange',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'player',
        component: () => import('@/views/djjl/player'),
        name: '选手管理',
        meta: { title: '选手管理', icon: 'people', roles: ['admin', 'guest'] }
      },
      {
        path: 'gift',
        component: () => import('@/views/djjl/gift'),
        name: '礼包管理',
        meta: { title: '礼包管理', icon: 'el-icon-cold-drink', roles: ['admin', 'guest'] }
      },
      {
        path: 'tag',
        component: () => import('@/views/resource/create_url'),
        name: '上传资源(url)',
        meta: { title: '上传资源(url)', icon: 'el-icon-document-add', roles: ['admin', 'guest'] }
      },
      {
        path: 'nick_name',
        component: () => import('@/views/resource/list'),
        name: '资源列表',
        meta: { title: '资源列表', icon: 'el-icon-document-copy', roles: ['admin', 'guest'] }
      }
    ]
  },
  {
    path: '/crawler',
    component: Layout,
    redirect: '/task/crawler/list',
    name: '爬虫管理',
    meta: {
      title: '爬虫管理',
      icon: 'bug',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'nba/list',
        component: () => import('@/views/crawler/nba'),
        name: 'cheerio-nba爬虫',
        meta: { title: 'cheerio-nba爬虫', icon: 'el-icon-basketball', roles: ['admin', 'guest'] }
      },
      {
        path: 'nba/plist',
        component: () => import('@/views/crawler/pnba'),
        name: 'puppeteer-nba爬虫',
        meta: { title: 'puppeteer-nba爬虫', icon: 'el-icon-basketball', roles: ['admin', 'guest'] }
      },
      {
        path: 'it/list',
        component: () => import('@/views/crawler/it'),
        name: 'puppeteer-技术爬虫',
        meta: { title: 'puppeteer-技术爬虫', icon: 'el-icon-monitor', roles: ['admin', 'guest'] }
      },
      {
        path: 'list',
        component: () => import('@/views/crawler/list'),
        name: '收藏列表',
        meta: { title: '收藏列表', icon: 'el-icon-folder', roles: ['admin', 'guest'] }
      }
    ]
  },
  {
    path: '/study',
    component: Layout,
    redirect: '/study/basic',
    name: '学习',
    meta: {
      title: '学习',
      icon: 'el-icon-notebook-2',
      roles: ['admin']
    },
    children: [
      {
        path: 'basic',
        component: () => import('@/views/study/basic'),
        name: '基础知识',
        meta: { title: '基础知识', icon: 'el-icon-cpu', roles: ['admin'] }
      },
      {
        path: 'nba/plist',
        component: () => import('@/views/crawler/pnba'),
        name: 'puppeteer-nba爬虫',
        meta: { title: 'puppeteer-nba爬虫', icon: 'el-icon-basketball', roles: ['admin', 'guest'] }
      },
      {
        path: 'it/list',
        component: () => import('@/views/crawler/it'),
        name: 'puppeteer-技术爬虫',
        meta: { title: 'puppeteer-技术爬虫', icon: 'el-icon-monitor', roles: ['admin', 'guest'] }
      },
      {
        path: 'list',
        component: () => import('@/views/crawler/list'),
        name: '收藏列表',
        meta: { title: '收藏列表', icon: 'el-icon-folder', roles: ['admin', 'guest'] }
      }
    ]
  },
  // {
  //   path: '/clockin',
  //   component: Layout,
  //   redirect: '/clockin/duty/list',
  //   name: '打卡',
  //   meta: {
  //     title: '打卡',
  //     icon: 'el-icon-circle-check',
  //     roles: ['admin', 'clockin', 'clockin_admin']
  //   },
  //   children: [
  //     {
  //       path: '/clockin/duty/list',
  //       component: () => import('@/views/clockin/dutylist'),
  //       name: '值日',
  //       meta: { title: '值日', icon: 'el-icon-delete', roles: ['admin', 'clockin', 'clockin_admin'] }
  //     },
  //     {
  //       path: '/clockin/duty/set',
  //       component: () => import('@/views/clockin/dutyset'),
  //       name: '值日安排',
  //       meta: { title: '值日安排', icon: 'el-icon-setting', roles: ['admin', 'clockin_admin'] }
  //     }
  //   ]
  // },
  {
    path: '/tool',
    component: Layout,
    redirect: '/tool/ocr',
    name: '小工具',
    meta: {
      title: '小工具',
      icon: 'el-icon-lollipop',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'ocr',
        component: () => import('@/views/tool/ocr'),
        name: '图片文字识别',
        meta: { title: '图片文字识别', icon: 'el-icon-picture', roles: ['admin', 'guest'] }
      },
      {
        path: 'content',
        component: () => import('@/views/tool/content'),
        name: '内容获取',
        meta: { title: '内容获取', icon: 'el-icon-search', roles: ['admin', 'guest'] }
      }
    ]
  },
  {
    path: '/socket',
    component: Layout,
    redirect: '/tool/ocr',
    name: '通信',
    meta: {
      title: '通信',
      icon: 'el-icon-phone-outline',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'ocr',
        component: () => import('@/views/socket/im'),
        name: 'im',
        meta: { title: 'im', icon: 'el-icon-chat-line-round', roles: ['admin', 'guest'] }
      },
      {
        path: 'content',
        component: () => import('@/views/tool/content'),
        name: '内容获取',
        meta: { title: '内容获取', icon: 'el-icon-search', roles: ['admin', 'guest'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    name: '用户',
    meta: {
      title: '用户',
      icon: 'el-icon-user-solid',
      roles: ['admin']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user'),
        name: 'User',
        meta: { title: '用户', icon: 'el-icon-user', roles: ['admin'] }
      },
      {
        path: 'role',
        component: () => import('@/views/role'),
        name: 'role',
        meta: { title: '权限', icon: 'el-icon-lock', roles: ['admin'] }
      },
      {
        path: 'logostat',
        component: () => import('@/views/user/logostat'),
        name: '用户登陆统计',
        meta: { title: '用户登陆统计', icon: 'el-icon-s-data', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/cms',
    name: '系统日志',
    meta: {
      title: '系统日志',
      icon: 'el-icon-files',
      roles: ['admin', 'guest']
    },
    children: [
      {
        path: 'cms',
        component: () => import('@/views/log/cms'),
        name: 'cms',
        meta: { title: 'cms', icon: 'el-icon-s-data', roles: ['admin', 'guest'] }
      },
      {
        path: 'blog',
        component: () => import('@/views/log/blog'),
        name: 'blog',
        meta: { title: 'blog', icon: 'el-icon-edit', roles: ['admin', 'guest'] }
      }
      // {
      //   path: 'blog-aggregate',
      //   component: () => import('@/views/log/blogAggregate'),
      //   name: 'blog聚合',
      //   meta: { title: 'blog聚合', icon: 'el-icon-c-scale-to-original', roles: ['admin'] }
      // }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
