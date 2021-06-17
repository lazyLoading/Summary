/*...关联管理*/

import http from "../utils/http";
// get请求
let resquest = process.env.VUE_APP_BASE_API;

//列表
export function enterpriseList(params) {
    return http.get(`${resquest}user-enterprise/v1/list`, params);
}

//新增
export function enterpriseAdd(params) {
    return http.post(`${resquest}user-enterprise/v1`, params);
}
//更新
export function enterpriseUpdate(params) {
    return http.putBody(
        `${resquest}user-enterprise/v1/${params.id}/buyer-update`,
        params.saveDTO
    );
}
//解除关联
export function enterpriseDel(params) {
    return http.delete(
        `${resquest}user-enterprise/v1/${params.id}/buyer`,
        params
    );
}

//供应商列表
export function enterpriseAll(params) {
    return http.get(`${resquest}enterprise/v1/all`, params);
}

//公司员工
export function enterpriseCompany(params) {
    return http.get(`${resquest}user/v1/users/current-company`, { ignoreRootUser: false });
}
//选择员工
export function companyUsers(params) {
    return http.get(`${resquest}role/v1/${params.roleId}/users`, params);
}

//公司角色
export function companyRole(params) {
    return http.get(`${resquest}role/v1/list?page=1&pageSize=2147483647`, params);
}

//拒绝记录
export function enterpriseRecord(params) {
    return http.get(`${resquest}user-enterprise/v1/refuse-record`, params);
}

//拒绝关联
export function enterpriseSupplierDel(id, params) {
    return http.deleteData(
        `${resquest}user-enterprise/v1/${id}/supplier`,
        params
    );
}

//确认关联
export function enterpriseSupplierPost(params) {
    return http.post(
        `${resquest}user-enterprise/v1/${params.ids[0]}/supplier`,
        params
    );
}

//拒绝原因列表
export function refuseList(params) {
    return http.get(`${resquest}refuse-reason/v1/list`, params);
}

//批量确认
export function batchConfirm(params) {
    return http.post(
        `${resquest}user-enterprise/v1/batch-confirm/supplier`,
        params
    );
}

//批量拒绝
export function batchRefuse(params) {
    return http.deleteData(
        `${resquest}user-enterprise/v1/batch-refuse/supplier`,
        params
    );
}