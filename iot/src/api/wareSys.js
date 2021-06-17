import request from '@/utils/request'
// GET / admin / user / list;查询
export function wareList(query) {
  return request({
    url: '/user/wareList',
    method: 'get',
    params: query
  })
}
// GET /admin/warehouse/getWarehouseTree 查询仓库树
export function getWarehouseTree(query) {
  return request({
    url: '/warehouse/getWarehouseTree',
    method: 'get',
    params: query
  })
}
// GET /admin/user/wareBigCancel 取消骑手，大骑手
export function wareCancel(query) {
  const t = query.userType === 3 ? 'wareCancle' : 'wareBigCancle'
  return request({
    url: `/user/${t}`,
    method: 'get',
    params: query
  })
}
// GET /admin/user/wareBigUpdate 设置骑手，大骑手
export function wareUpdate(query, type) {
  const t = type ? 'wareUpdate' : 'wareBigUpdate'
  return request({
    url: `/user/${t}`,
    method: 'get',
    params: query
  })
}
// GET / admin / user / updateMobile; 更新手机号
export function updateMobile(query) {
  return request({
    url: `/user/updateMobile`,
    method: 'get',
    params: query
  })
}
