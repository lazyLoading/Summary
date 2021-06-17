
import request from '@/utils/request'
// POST /admin/event/create 项目新增
export function create(data) {
  return request({
    url: '/event/create',
    method: 'post',
    data
  })
}
// POST /admin/event/delete 删除
export function eventDelete(data) {
  return request({
    url: '/event/delete',
    method: 'post',
    data
  })
}

// GET /admin/event/detail 项目详情
export function detail(query) {
  return request({
    url: '/event/detail',
    method: 'get',
    params: query
  })
}
// GET /admin/event/list 项目集合
export function list(query) {
  return request({
    url: '/event/list',
    method: 'get',
    params: query
  })
}
// POST /admin/event/update 修改项目
export function update(data) {
  return request({
    url: '/event/update',
    method: 'post',
    data
  })
}
// GET /admin/event/listParam 问题录入查询关联项目list
export function listParam(query) {
  return request({
    url: '/event/listParam',
    method: 'get',
    params: query
  })
}

