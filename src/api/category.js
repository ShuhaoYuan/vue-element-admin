import { service as request } from '@/utils/request'

export function getCategories() {
  return request({
    url: '/category/details',
    method: 'get'
  })
}

export function getCategoriesTree() {
  return request({
    url: '/category/tree',
    method: 'get'
  })
}
