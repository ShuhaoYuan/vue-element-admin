/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const categoryRouter = {
  path: '/category',
  component: Layout,
  redirect: '/category',
  name: 'Category',
  meta: {
    title: '类型管理',
    icon: 'table'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/category/category'),
      name: 'Category',
      meta: { title: '类型列表' }
    }
  ]
}
export default categoryRouter
