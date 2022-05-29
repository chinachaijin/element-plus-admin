import request from '@/utils/request'

export function getindex(params) {
  return request({
    url: '/apps/index',
    method: 'get',
    params
  })
}

export function createAdmin(data) {
  return request({
    url: '/apps/new',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/apps/edit',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/apps/del',
    method: 'post',
    data
  })
}

export function rolesadmin() {
  return request({
    url: '/apps/roles',
    method: 'get'
  })
}