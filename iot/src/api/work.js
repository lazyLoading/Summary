
import request from '@/utils/request'
// GET /admin/daliy/list;分页列表
export function list(query) {
  return request({
    url: '/daliy/list',
    method: 'get',
    params: query
  })
}
// POST /admin/daliy/delete 删除
export function daliyDelete(data) {
  return request({
    url: `/daliy/delete`,
    method: 'post',
    data
  })
}
// POST /admin/daliy/create 新增;
export function create(data) {
  return request({
    url: '/daliy/create',
    method: 'post',
    data
  })
}
// POST /admin/daliy/update; 修改
export function update(data) {
  return request({
    url: `/daliy/update`,
    method: 'post',
    data
  })
}
