import request from '@/utils/request'

function listLoginLog(data) {
  return request({
    url: '/system/loginlog/list',
    method: 'post',
    data
  })
}
export {
  listLoginLog,
}
