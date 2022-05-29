import request from '@/utils/request'

export function getindex(params) {
  return request({
    url: '/admins/index',
    method: 'get',
    params
  })
}

export function createAdmin(data) {
  return request({
    url: '/admins/new',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admins/edit',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/admins/del',
    method: 'post',
    data
  })
}

export function isenableAdmin(data) {
  return request({
    url: '/admins/isenable',
    method: 'post',
    data
  })
}

export function rolesadmin() {
  return request({
    url: '/admins/roles',
    method: 'get'
  })
}