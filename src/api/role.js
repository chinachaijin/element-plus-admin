import request from '@/utils/request'

export function getindex(params) {
  return request({
    url: '/roles/index',
    method: 'get',
    params
  })
}

export function createAdmin(data) {
  return request({
    url: '/roles/new',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/roles/edit',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/roles/del',
    method: 'post',
    data
  })
}

export function isenableAdmin(data) {
  return request({
    url: '/roles/isenable',
    method: 'post',
    data
  })
}

export function adminrole() {
  return request({
    url: '/roles/admin',
    method: 'get',
  })
}

export function contsetrole() {
  return request({
    url: '/roles/contset',
    method: 'get',
  })
}
