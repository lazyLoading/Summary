import Layout from '@/layout/Layout'
export const systemsAnaysis = {
  path: '/systemsAnaysis',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'SystemsAnaysis',
  meta: {
    title: '系统分析',
    icon: 'el-icon-s-data'
  },
  children: [
    {
      path: 'problem',
      component: () => import('@/views/systemsAnaysis/problem'),
      name: 'Problem',
      meta: {
        title: '问题分析',
        noCache: true
      }
    },

    {
      path: 'earlyWarn',
      component: () => import('@/views/systemsAnaysis/earlyWarn'),
      name: 'EarlyWarn',
      meta: {
        title: '预警',
        noCache: true
      }
    }
  ]
}
