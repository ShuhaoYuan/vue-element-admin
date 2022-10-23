import { service as request } from '@/utils/request'

export function refund(order_id) {
  return request({
    url: '/admin/order/refund',
    method: 'post',
    data: { order_id: order_id }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/login/logout',
    method: 'post'
  })
}
