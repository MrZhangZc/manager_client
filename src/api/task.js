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
export function addNote(data) {
  return request({
    url: '/note',
    method: 'post',
    data
  })
}

export function fetchNote(query) {
  return request({
    url: '/note',
    method: 'get',
    params: query
  })
}
/**
 * 更新对象
 */
export function updateNote(id, data) {
  return request({
    url: `/note/edit/${id}`,
    method: 'put',
    data
  })
}
export function finishNote(id, data) {
  return request({
    url: `/note/finish/${id}`,
    method: 'patch',
    data
  })
}
export function remindNote(id, query = {}) {
  return request({
    url: `/note/remind/${id}`,
    method: 'get',
    query
  })
}
/**
 * 删除对象
 */
export function deleteNote(id) {
  return request({
    url: `/note/${id}`,
    method: 'delete'
  })
}
