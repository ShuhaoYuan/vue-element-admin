/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const paymentRouter = {
  path: '/payment',
  component: Layout,
  redirect: '/payment',
  name: 'payment',
  meta: {
    title: '支付与财务管理',
    icon: 'table'
  },
  children: [
    {
      path: 'user_promote',
      component: () => import('@/views/payment/user_promote'),
      name: 'user_promote',
      meta: { title: '用户推广查询' }
    }
  ]
}
export default paymentRouter
