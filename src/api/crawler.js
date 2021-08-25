import request from '@/utils/request'

export function saveNews(data) {
  return request({
    url: '/crawler',
    method: 'post',
    data
  })
}

export function crawlerList(query) {
  return request({
    url: '/crawler/list',
    method: 'get',
    params: query
  })
}

export function fetchNews(query) {
  return request({
    url: '/crawler',
    method: 'get',
    params: query
  })
}
export function fetchNbaNews(query) {
  return request({
    url: '/crawler/nba',
    method: 'get',
    params: query
  })
}

export function deleteNews(id) {
  return request({
    url: `/crawler/${id}`,
    method: 'delete'
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

export function screenShot(query) {
  return request({
    url: '/resource/screenShot',
    method: 'get',
    params: query
  })
}

