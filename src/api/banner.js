import request from '@/utils/request'

export function getBanner(query) {
  return request({
    url: '/banner',
    method: 'get',
    params: query
  })
}

export function addBanner(data) {
  return request({
    url: '/banner',
    method: 'post',
    data
  })
}

export function updateBanner(id, data) {
  return request({
    url: `/banner/${id}`,
    method: 'put',
    data
  })
}

export function deleteBanner(id) {
  return request({
    url: `/banner/${id}`,
    method: 'delete'
  })
}
