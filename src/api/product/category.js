import request from '@/utils/request'

function addCategory(query) {
  return request({
    url: '/product/category/add',
    method: 'post',
    params: query
  })
}

function getCategory(query) {
  return request({
    url: '/product/category/get',
    method: 'get',
    params: query
  })
}
function listCategory(query) {
  return request({
    url: '/product/category/list',
    method: 'get',
    params: query
  })
}
function deleteCategory(query) {
  return request({
    url: '/product/category/delete',
    method: 'delete',
    params: query
  })
}
function updateCategory(query) {
  return request({
    url: '/product/category/update',
    method: 'update',
    params: query
  })
}
export {
  addCategory,
  getCategory,
  listCategory,
  deleteCategory,
  updateCategory,
}
