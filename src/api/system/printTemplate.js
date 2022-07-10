import request from '@/utils/request'

function getPrinter(params) {
  return request({
    url: '/system/printer/view',
    method: 'get',
    params
  })
}

function listPrinter(data) {
  return request({
    url: '/system/printer/list',
    method: 'post',
    data
  })
}
function listAllPrinter() {
  return request({
    url: '/system/printer/list/all',
    method: 'get',
  })
}

function deletePrinter(params) {
  return request({
    url: '/system/printer/delete',
    method: 'get',
    params
  })
}

function saveOrUpdatePrinter(data) {
  return request({
    url: '/system/printer/saveOrUpdate',
    method: 'post',
    data
  })
}

function validOrInValidPrinter(id, k = "") {
  return request({
    url: `/system/printer/${k.toLowerCase()}`,
    method: 'get',
    params: {id}
  })
}



export {
  getPrinter,
  listPrinter,
  deletePrinter,
  listAllPrinter,
  saveOrUpdatePrinter,
  validOrInValidPrinter,
}
