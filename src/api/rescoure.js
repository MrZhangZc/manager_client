import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function fetch(query) {
  return request({
    url: '/resource',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 */
export function addModel(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}
/**
 * 更新对象
 */
export function updateModel(id, data) {
  return request({
    url: `/resource/${id}`,
    method: 'put',
    data
  })
}
/**
 * 删除对象
 */
export function deleteModel(id) {
  return request({
    url: `/resource/${id}`,
    method: 'delete'
  })
}
