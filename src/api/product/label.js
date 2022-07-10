import request from '@/utils/request'

function getLabel(params) {
  return request({
    url: '/product/label/view',
    method: 'get',
    params
  })
}

function listLabel(data) {
  return request({
    url: '/product/label/list',
    method: 'post',
    data
  })
}

function deleteLabel(params) {
  return request({
    url: '/product/label/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateLabel(data) {
  return request({
    url: '/product/label/save',
    method: 'post',
    data
  })
}

export {
  getLabel,
  listLabel,
  deleteLabel,
  saveOrUpdateLabel,
}
