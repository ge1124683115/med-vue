import request from '@/utils/request'

function getRole(params) {
  return request({
    url: '/system/role/view',
    method: 'get',
    params
  })
}

function listRole(data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    data
  })
}

function deleteRole(params) {
  return request({
    url: '/system/role/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateRole(data) {
  return request({
    url: '/system/role/saveOrUpdate',
    method: 'post',
    data
  })
}

function validOrInValidRole(id, k = "") {
  return request({
    url: `/system/role/${k.toLowerCase()}`,
    method: 'get',
    params: {id}
  })
}

function getRolePermission(roleId) {
  return request({
    url: '/system/role/permission/list',
    method: 'get',
    params: {roleId}
  })
}

function saveOrUpdateRolePermission(data) {
  return request({
    url: '/system/role/permission/saveOrUpdate',
    method: 'post',
    data
  })
}
function getCurrentUserPermission(userId) {
  return request({
    url: '/system/user/role/permission/all',
    method: 'get',
    params:{userId}
  })
}
function batchDeleteUserPermission(userIds,roleIds) {
  return request({
    url: '/system/user/role/delete/all',
    method: 'get',
    data:{userIds,roleIds}
  })
}
function batchSaveOrUpdateUserPermission(userIds,roleIds) {
  return request({
    url: '/system/user/role/saveOrUpdate',
    method: 'post',
    data:{userIds,roleIds}
  })
}


export {
  getRole,
  listRole,
  deleteRole,
  saveOrUpdateRole,
  getRolePermission,
  validOrInValidRole,
  getCurrentUserPermission,
  batchDeleteUserPermission,
  saveOrUpdateRolePermission,
  batchSaveOrUpdateUserPermission,
}
