import request from '@/utils/request'

export function addDuty(data) {
  return request({
    url: '/clockin/duty',
    method: 'post',
    data
  })
}

export function dutyList(query) {
  return request({
    url: '/clockin/duty',
    method: 'get',
    params: query
  })
}

export function dutyStatusUpdate(id, data) {
  return request({
    url: `/clockin/duty/status/${id}`,
    method: 'patch',
    data
  })
}

export function getMonthDutyExits(query) {
  return request({
    url: '/clockin/duty/exist',
    method: 'get',
    params: query
  })
}

export function clockinUsers() {
  return request({
    url: '/clockin/user',
    method: 'get',
    params: {}
  })
}

