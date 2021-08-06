import request from '@/utils/request'

export function ocr(query) {
  return request({
    url: '/db/ocr',
    method: 'get',
    params: query
  })
}
