import request from '@/utils/request'

function listTenantStore(tenantId) {
  return request({
    url: `/store/all/${tenantId}`,
    method: 'get',
  })
}

export {
  listTenantStore,
}
