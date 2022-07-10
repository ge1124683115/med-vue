import request from '@/utils/request'

function getTenant(params) {
  return request({
    url: '/tenant/view',
    method: 'get',
    params
  })
}

function listTenant(data) {
  return request({
    url: '/tenant/list',
    method: 'post',
    data
  })
}

function deleteTenant(params) {
  return request({
    url: '/tenant/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateTenant(data) {
  return request({
    url: '/tenant/saveOrUpdate',
    method: 'post',
    data
  })
}

function validOrInValidTenant(id, k = "") {
  return request({
    url: `/tenant/${k.toLowerCase()}`,
    method: 'get',
    params: {id}
  })
}

export {
  getTenant,
  listTenant,
  deleteTenant,
  saveOrUpdateTenant,
  validOrInValidTenant,
}
