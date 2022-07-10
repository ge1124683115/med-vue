import request from '@/utils/request'

function listBusinessLog(data) {
  return request({
    url: '/system/log/list',
    method: 'post',
    data
  })
}
export {
  listBusinessLog,
}
