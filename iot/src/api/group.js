import request from '@/utils/request'
// GET / admin / syxsoftGrouponInfo / list;分页列表
export function syxsoftGrouponInfoList(query) {
  return request({
    url: '/syxsoftGrouponInfo/list',
    method: 'get',
    params: query
  })
}
// POST /admin/syxsoftGrouponInfo/delete/{id} 删除
export function syxsoftGrouponInfoDelete(id) {
  return request({
    url: `/syxsoftGrouponInfo/delete/${id}`,
    method: 'post'
  })
}
// POST / admin / syxsoftGrouponInfo / add 新增;
export function syxsoftGrouponInfoAdd(data) {
  return request({
    url: '/syxsoftGrouponInfo/add',
    method: 'post',
    data
  })
}
// POST / admin / syxsoftGrouponInfo / update / { id }; 修改
export function syxsoftGrouponInfoUpdate(data) {
  return request({
    url: `/syxsoftGrouponInfo/update/${data.id}`,
    method: 'post',
    data
  })
}
// 分页查询小区 GET /admin/pnpArea/list
export function pnpAreaList(query) {
  return request({
    url: '/pnpArea/list',
    method: 'get',
    params: query
  })
}
// GET / admin / syxsoftGrouponInfo / get / { id }; 关联商品查询
export function syxsoftGrouponInfoGet(query) {
  return request({
    url: `/syxsoftGrouponInfo/get/${query}`,
    method: 'get',
    params: query
  })
}
// 查询所有商品 GET /admin/syxsoftGrouponInfo/listAllGoods
export function listAllGoods() {
  return request({
    url: `/syxsoftGrouponInfo/listAllGoods`,
    method: 'get'
  })
}
