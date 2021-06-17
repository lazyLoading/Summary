import Layout from '@/layout/Layout'
export const other = {
  path: '/other',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'Other',
  meta: {
    title: '内控体系建设',
    icon: 'el-icon-s-finance'
  },
  children: [
    {
      path: 'control',
      component: () => import('@/views/other/control'),
      name: 'Control',
      meta: {
        title: '内控建设',
        noCache: true
      }
    }
  ]
}
