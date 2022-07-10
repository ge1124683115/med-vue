import request from '@/utils/request'

function getDictionary(params) {
  return request({
    url: '/system/dictionary/view',
    method: 'get',
    params
  })
}

function listDictionary(data) {
  return request({
    url: '/system/dictionary/list',
    method: 'post',
    data
  })
}

function listAllDictionary() {
  return request({
    // url: '/system/dictionary/list/simple',
    url: '/system/dictionary/list/platform/simple',
    method: 'get',
  })
}

/**
 * 根据类别、代码查询其所有子项
 * @param data
 * @returns {AxiosPromise}
 */
function findChildrenDictionary(parentCode, code = null) {
  return request({
    url: '/system/dictionary/find-chilren',
    method: 'get',
    params: {code, parentCode}
  })
}

/**
 * 根据类别、代码查询其所有子项
 * @param data
 * @returns {AxiosPromise}
 */
function findChildrenDictionaryByTenantId(parentCode, tenantId, code = null) {
  return request({
    url: `/system/dictionary/find-chilren/${tenantId}`,
    method: 'get',
    params: {code, parentCode}
  })
}

function listItemBigClass() {
  return findChildrenDictionary('bigClassCode')
}

function findAllChildrenDictionary(code) {
  return request({
    url: '/system/dictionary/find-all-chilren',
    method: 'get',
    params: {code}
  })
}

function deleteDictionary(params) {
  return request({
    url: '/system/dictionary/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateDictionary(data) {
  return request({
    url: '/system/dictionary/save-or-update',
    method: 'post',
    data
  })
}

function branchSaveOrUpdateDictionary(data = []) {
  return request({
    url: '/system/dictionary/save-or-updates',
    method: 'post',
    data
  })
}


export {
  getDictionary,
  listDictionary,
  deleteDictionary,
  listItemBigClass,
  listAllDictionary,
  saveOrUpdateDictionary,
  findChildrenDictionary,
  findAllChildrenDictionary,
  branchSaveOrUpdateDictionary,
  findChildrenDictionaryByTenantId,
}
