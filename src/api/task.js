import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function fetchEmail(query) {
  return request({
    url: '/task/email',
    method: 'get',
    params: query
  })
}

export function sendEmail(query) {
  return request({
    url: '/task/sendmail',
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
