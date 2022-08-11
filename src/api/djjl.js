import request from '@/utils/request'

export function getPlayer(query) {
  return request({
    url: '/djjl/player',
    method: 'get',
    params: query
  })
}

export function getDjjlGift(query) {
  return request({
    url: '/djjl/gift',
    method: 'get',
    params: query
  })
}

export function addDjjlGift(data) {
  return request({
    url: '/djjl/gift',
    method: 'post',
    data
  })
}

export function updateDjjlGift(id, data) {
  return request({
    url: `/djjl/gift/${id}`,
    method: 'put',
    data
  })
}

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
