import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}

export function searchCategory(name) {
  return request({
    url: '/article/category',
    method: 'get',
    params: { name }
  })
}

export function publistArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}