import Layout from '@/layout/Layout'
export const every = {
  path: '/every',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'Every',
  meta: {
    title: '日常工作',
    icon: 'el-icon-s-finance'
  },
  children: [

    {
      path: 'work',
      component: () => import('@/views/every/work'),
      name: 'Work',
      meta: {
        title: '日常工作',
        noCache: true
      }
    }
  ]
}
