/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order',
  name: 'Order',
  meta: {
    title: '订单管理',
    icon: 'table'
  },
  children: [
    {
      path: 'order',
      component: () => import('@/views/order/orders'),
      name: 'Order',
      meta: { title: '订单' }
    }
  ]
}
export default orderRouter
