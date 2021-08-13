import request from '@/utils/request'

export function fetchCmsLog(query) {
  return request({
    url: '/log/cms',
    method: 'get',
    params: query
  })
}

export function fetchBlogLog(query) {
  return request({
    url: '/log/blog',
    method: 'get',
    params: query
  })
}

export function fetchBlogGroup(query) {
  return request({
    url: '/log/blog_group',
    method: 'get',
    params: query
  })
}
