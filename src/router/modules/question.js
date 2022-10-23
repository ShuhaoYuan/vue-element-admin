/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const questionRouter = {
  path: '/question',
  component: Layout,
  redirect: '/question',
  name: 'Question',
  meta: {
    title: '题目管理',
    icon: 'table'
  },
  children: [
    {
      path: 'compare',
      component: () => import('@/views/question/compare'),
      name: 'Compare',
      meta: { title: '比较题目' }
    },
    {
      path: 'search',
      component: () => import('@/views/question/search'),
      name: 'Search',
      meta: { title: '题目搜索' }
    },
    {
      path: 'upload_file',
      component: () => import('@/views/question/upload_file'),
      name: '上传题目',
      meta: { title: '上传题目' }
    },
    {
      path: 'check_question',
      component: () => import('@/views/question/check_question'),
      name: 'CheckQuestion',
      meta: { title: '检查并添加题目' }
    },
    {
      path: 'check_replace',
      component: () => import('@/views/question/check_replace'),
      name: 'CheckReplace',
      meta: { title: '检查并替换题目' }
    },
    {
      path: 'add_analysis',
      component: () => import('@/views/question/add_analysis'),
      name: 'AddAnalysis',
      meta: { title: '添加解析' }
    }
  ]
}
export default questionRouter
