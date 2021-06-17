import Layout from '@/layout/Layout'
export const profile = {
  path: '/profile',
  component: Layout,
  redirect: 'noredirect',
  alwaysShow: true,
  children: [
    {
      path: 'password',
      component: () => import('@/views/profile/password'),
      name: 'Password',
      meta: { title: '修改密码', noCache: true }
    },
    {
      path: 'notice',
      component: () => import('@/views/profile/notice'),
      name: 'Notice',
      meta: { title: '通知中心', noCache: true }
    }
  ],
  hidden: true
}
