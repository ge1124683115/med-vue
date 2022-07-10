import request from '@/utils/request'
import {camelToLine} from "@/utils";

function getProduct(params) {
  return request({
    url: '/product/view',
    method: 'get',
    params
  })
}

function listProduct(data) {
  return request({
    url: '/product/list',
    method: 'post',
    data
  })
}

function deleteProduct(params) {
  return request({
    url: '/product/delete',
    method: 'get',
    params
  })
}

function saveOrUpdateProduct(data) {
  return request({
    url: '/product/saveOrUpdate',
    method: 'post',
    data
  })
}
function batchUpdateProductWarningOrRemind(data,key) {
  return request({
    url: `/product/batch_${camelToLine(key)}`,
    method: 'post',
    data
  })
}
function getProductOperation(productId) {
  return request({
    url: '/product/operation-sequence',
    method: 'get',
    params:{productId}
  })
}
function getNo(length=12) {
  return request({
    url: `/system/no/general/${length}`,
    method: 'get',
  })
}

export {
  getNo,
  getProduct,
  listProduct,
  deleteProduct,
  getProductOperation,
  saveOrUpdateProduct,
  batchUpdateProductWarningOrRemind,
}
