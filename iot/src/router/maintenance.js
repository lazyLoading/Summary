import Layout from '@/layout/Layout'
export const maintenance = {
  path: '/maintenance',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'Maintenance',
  meta: {
    title: '问题管理',
    icon: 'el-icon-s-opportunity'
  },
  children: [
    {
      path: 'proj',
      name: 'Proj',
      component: () => import('@/views/maintenance/proj'),
      meta: {
        title: '项目管理',
        perms: [
          'GET /admin/event/list',
          'POST /admin/event/create',
          'GET /admin/event/listParam',
          'POST /admin/event/update',
          'GET /admin/event/detail',
          'POST /admin/event/delete'
        ]
      }
    },
    {
      path: 'troubleshoot',
      name: 'Troubleshoot',
      component: () => import('@/views/maintenance/troubleshoot'),
      meta: {
        title: '检查排查项目'
      }
    },
    {
      path: 'problemEntry',
      name: 'ProblemEntry',
      component: () => import('@/views/maintenance/problemEntry'),
      meta: {
        title: '问题录入'
      }
    },
    {
      path: 'problemReview',
      name: 'ProblemReview',
      component: () =>
               import('@/views/maintenance/problemReview'),
      meta: {
        title: '问题复核'
      }
    },
    {
      path: 'problemMaint',
      name: 'ProblemMaint',
      component: () => import('@/views/maintenance/problemMaint'),
      meta: {
        title: '问题类目维护'
      }
    },
    {
      path: 'problemRect',
      name: 'ProblemRect',
      component: () => import('@/views/maintenance/problemRect'),
      meta: {
        title: '问题整改'
      }
    }
  ]
}
