import request from '@/utils/request'
function listUserStore(data) {
  return request({
    url: '/userstore/list/apply',
    method: 'post',
    data
  })
}
function approveUserStore(params) {
  return request({
    url: '/userstore/approve',
    method: 'get',
    params
  })
}

function removeUserStore(params) {
  return request({
    url: '/userstore/remove',
    method: 'get',
    params
  })
}
export {
  listUserStore,
  removeUserStore,
  approveUserStore,
}
