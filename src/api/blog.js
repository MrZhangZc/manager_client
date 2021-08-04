import request from '@/utils/request'

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

export function fetchArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

export function publistArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/article/edit/${data._id}`,
    method: 'put',
    data
  })
}

export function getCategory(query) {
  return request({
    url: '/article/categorylist',
    method: 'get',
    params: query
  })
}

export function addCreate(data) {
  return request({
    url: '/article/category',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/article/category/${id}`,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/article/category/${id}`,
    method: 'delete'
  })
}
