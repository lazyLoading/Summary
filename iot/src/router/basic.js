import Layout from '@/layout/Layout'
export const basic = {
  path: '/basic',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'Basic',
  meta: {
    title: '系统管理',
    icon: 'el-icon-s-cooperation'
  },
  children: [
    {
      path: 'admin',
      component: () => import('@/views/basic/admin'),
      name: 'Admin',
      meta: {
        perms: [
          'GET /admin/admin/list',
          'POST /admin/admin/create',
          'POST /admin/admin/update',
          'POST /admin/admin/delete'
        ],
        title: '用户管理',
        noCache: true
      }
    },

    {
      path: 'role',
      component: () => import('@/views/basic/role'),
      name: 'Role',
      meta: {
        perms: [
          'GET /admin/role/list',
          'POST /admin/role/create',
          'POST /admin/role/update',
          'POST /admin/role/delete',
          'GET /admin/role/permissions',
          'POST /admin/role/permissions'
        ],
        title: '角色管理',
        noCache: true
      }
    },
    {
      path: 'businessMenu',
      component: () => import('@/views/basic/businessMenu'),
      name: 'BusinessMenu',
      meta: {
        title: '业务菜单管理',
        noCache: true
      }
    },
    {
      path: 'log',
      component: () => import('@/views/basic/log'),
      name: 'Log',
      meta: {
        perms: ['GET /admin/log/list'],
        title: '操作日志',
        noCache: true
      }
    },
    {
      path: 'orgInfo',
      component: () => import('@/views/basic/orgInfo'),
      name: 'OrgInfo',
      meta: {
        title: '机构信息维护',
        noCache: true
      }
    }
  ]
}
