import request from '@/utils/request'

function addStore(query) {
  return request({
    url: '/store/list',
    method: 'get',
    params: query
  })
}

function getStore(query) {
  return request({
    url: '/store/list',
    method: 'get',
    params: query
  })
}
function listStore(data) {
  return request({
    url: '/store/list',
    method: 'post',
    data
  })
}
function listAllStore() {
  return request({
    url: '/store/all',
    method: 'get',
  })
}
function deleteStore(params) {
  return request({
    url: '/store/delete',
    method: 'get',
    params
  })
}
function saveOrUpdateStore(data) {
  return request({
    url: '/store/saveOrUpdate',
    method: 'post',
    data
  })
}
function validOrInValidStore(id, k = "") {
  return request({
    url: `/store/${k.toLowerCase()}`,
    method: 'get',
    params: {id}
  })
}
export {
  addStore,
  getStore,
  listStore,
  deleteStore,
  listAllStore,
  saveOrUpdateStore,
  validOrInValidStore,
}
