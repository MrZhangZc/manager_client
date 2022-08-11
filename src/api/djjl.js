import request from '@/utils/request'

export function getPlayer(query) {
  return request({
    url: '/djjl/player',
    method: 'get',
    params: query
  })
}

export function addPlayer(data) {
  return request({
    url: '/djjl/player',
    method: 'post',
    data
  })
}

export function updatePlayer(id, data) {
  return request({
    url: `/djjl/player/${id}`,
    method: 'put',
    data
  })
}

export function getDjjlGift(query) {
  return request({
    url: '/djjl/gift',
    method: 'get',
    params: query
  })
}

export function getHero(query) {
  return request({
    url: '/djjl/hero',
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

export function addHero(data) {
  return request({
    url: '/djjl/hero',
    method: 'post',
    data
  })
}

export function updateHero(id, data) {
  return request({
    url: `/djjl/hero/${id}`,
    method: 'put',
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

export function getAllHero() {
  return request({
    url: `/djjl/all_hero`,
    method: 'get'
  })
}

export function getAllSkill() {
  return request({
    url: `/djjl/all_skill`,
    method: 'get'
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
