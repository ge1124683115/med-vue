import request from '@/utils/request'

function listDept(data) {
  return request({
    url: '/store/department/list',
    method: 'post',
    data
  })
}
function listDeptByStoreId(storeId) {
  return request({
    url: '/store/department/list/all',
    method: 'get',
    params:{storeId}
  })
}
function deleteDept(params) {
  return request({
    url: '/store/department/delete',
    method: 'get',
    params
  })
}
function saveOrUpdateDept(data) {
  return request({
    url: '/store/department/saveOrUpdate',
    method: 'post',
    data
  })
}
function changeDisplayLocation(id,displayLocation) {
  return request({
    url: '/store/department/openclose',
    method: 'get',
    params:{id,displayLocation}
  })
}
export {
  listDept,
  deleteDept,
  saveOrUpdateDept,
  listDeptByStoreId,
  changeDisplayLocation,
}
