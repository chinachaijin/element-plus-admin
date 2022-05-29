import request from '@/utils/request'

export function getindex(params) {
  return request({
    url: '/configs/index',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: '/configs/new',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/configs/edit',
    method: 'post',
    data
  })
}

export function uploadimg(data) {
  let formData = new FormData()
  let keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i],data[keys[i]])
  }

  return request({
    url: '/configs/img',
    method: 'post',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadfile(data) {
  let formData = new FormData()
  let keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i],data[keys[i]])
  }

  return request({
    url: '/configs/file',
    method: 'post',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function destroy(data) {
  return request({
    url: '/configs/del',
    method: 'post',
    data
  })
}

export function issystem(data) {
  return request({
    url: '/configs/issystem',
    method: 'post',
    data
  })
}

export function getindexall() {
  return request({
    url: '/configsets/indexall',
    method: 'get'
  })
}

export function setconfigs(data) {
  return request({
    url: '/configsets/setvalue',
    method: 'post',
    data
  })
}

export function uploadimgset(data) {
  let formData = new FormData()
  let keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i],data[keys[i]])
  }

  return request({
    url: '/configsets/img',
    method: 'post',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadfileset(data) {
  let formData = new FormData()
  let keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i],data[keys[i]])
  }

  return request({
    url: '/configsets/file',
    method: 'post',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}