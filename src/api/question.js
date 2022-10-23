import { service2 as request } from '@/utils/request'

export function compareQuestions(category_id) {
  return request({
    url: '/question/compare/' + category_id,
    method: 'get'
  })
}

export function getCategory() {
  return request({
    url: '/question/category',
    method: 'get'
  })
}

export function searchQuestion(category_id, keyword) {
  return request({
    url: '/question/search',
    method: 'post',
    data: { category_id: category_id, keyword: keyword }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}

export function uploadTmpQuestions(data) {
  return request({
    url: '/admin/question/upload_tmp_questions',
    method: 'post',
    data
  })
}

export function compareNextQuestion(category_id) {
  return request({
    url: '/admin/question/compare/next/' + category_id,
    method: 'get'
  })
}

export function compareAllNext() {
  return request({
    url: '/admin/question/compare/all/next',
    method: 'get'
  })
}

export function updateTmp(id, category_id, is_available, match_id = null) {
  const data = {
    category_id: category_id,
    id: id,
    is_available: is_available,
    match_id: match_id
  }

  console.log(data)
  return request({
    url: '/admin/question/compare/update',
    method: 'post',
    data: data
  })
}

export function get_questions(category_id, no_analysis, all_panduan, all_wrong) {
  return request({
    url: `/admin/question/analysis/questions?category_id=${category_id}&no_analysis=${no_analysis}&all_panduan=${all_panduan}&all_wrong=${all_wrong}`,
    method: 'get'
  })
}

export function update_question_analysis(id, analysis) {
  return request({
    url: '/admin/question/analysis/update',
    method: 'post',
    data: { id, analysis }
  })
}
