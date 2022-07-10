import request from '@/utils/request'

function getProfile(id) {
  return request({
    url: '/tenant/view',
    method: 'get',
    params:{id}
  })
}
function updateProfile(data) {
  return request({
    url: '/enterprise/profile',
    method: 'update',
    data
  })
}

export {
  getProfile,
  updateProfile,
}
