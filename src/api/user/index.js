import request from '@/utils/request'

function getUser(params) {
  return request({
    url: '/user/view',
    method: 'get',
    params
  })
}

function listUser(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

function deleteUser(params) {
  return request({
    url: '/user/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateUser(data) {
  return request({
    url: '/user/saveOrUpdate',
    method: 'post',
    data
  })
}

function validOrInValidUser(id, k = "") {
  return request({
    url: `/user/${k.toLowerCase()}`,
    method: 'get',
    params: {id}
  })
}

export {
  getUser,
  listUser,
  deleteUser,
  saveOrUpdateUser,
  validOrInValidUser,
}
