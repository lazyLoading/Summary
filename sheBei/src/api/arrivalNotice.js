import http from "../utils/http";
// get请求
let resquest = process.env.VUE_APP_BASE_API;
// let resquest = 'http://172.16.41.12:8080/'   //李泉
// let resquest = 'http://172.16.41.21:8080/'   //yy

// 获取到货通知单列表
export function getList(params) {
    return http.get(`${resquest}requirement/v1/list`, params);
}

// 新增到货单
export function getCreateArrival(params) {
    return http.post(`${resquest}requirement/v1/create`, params);
}

// 编辑到货单
export function updateArrival(params) {
    return http.putBody(`${resquest}requirement/v1/update`, params);
}

// 生成发货单编号
export function getCargoCode() {
    return http.get(`${resquest}cargo/v1/cargo-code`);
}
// 生成退货单编号
export function getRejectedCode() {
    return http.get(`${resquest}rejected/v1/rejected-code`);
}

// 新增到货通知单
export function getRequirementCode(params) {
    return http.get(`${resquest}requirement/v1/requirement-code`, params);
}
// 批量更改到货通知单状态
export function updateItem(params) {
    return http.putBody(`${resquest}requirement/v1/batch-update-status`, params);
}

// 退货单/退货反馈列表 分页查询
export function getReturnList(params) {
    let targetParams = {...params, ...{entranceMark: localStorage.getItem("types")} }
    return http.get(`${resquest}rejected/v1/list`, targetParams);
}

// 退货单 批量下发
export function updateReturnItem(params, status) {
    return http.post(`${resquest}rejected/v1/buyer/status-batch/${status}`, params);
}

// 退货单 撤回
export function getReturnBack(params) {
    return http.putBody(`${resquest}rejected/v1/buyer/${params.id}/update-status/${params.status}`, {});
}

// 退货单 拒绝
export function getRefuse(params,reason) {
    return http.putBody(`${resquest}rejected/v1/supplier/status-refused/${reason}`, params);
}

// 退货单 批量删除
export function getReturnDelete(params) {
    return http.post(`${resquest}rejected/v1/buyer/del-batch`, params);
}
// 退货单 新增
export function getReturnCreate(params) {
    return http.post(`${resquest}rejected/v1/buyer/create`, params);
}
// 退货单 编辑
export function getReturnUpdate(params, id) {
    return http.putBody(`${resquest}rejected/v1/buyer/${id}/update`, params);
}

// 发货单/收货单列表 分页查询
export function getDispatchList(params) {
    let targetParams = {...params, ...{entranceMark: localStorage.getItem("types")} }
    return http.get(`${resquest}cargo/v1/list`, targetParams);
}

// 发货单 批量发货
export function updateDispatchItem(params) {
    return http.putBody(`${resquest}cargo/v1/supplier/status-batch`, params);
}
// 发货单 撤回
export function getBack(params) {
    return http.putBody(`${resquest}cargo/v1/supplier/${params.id}/update-status/${params.status}`, {});
}
// 发货单 批量删除
export function getDelete(params) {
    return http.deleteData(`${resquest}cargo/v1/supplier/del-batch`, params);
}
// 发货单 新增
export function getCreate(params) {
    return http.post(`${resquest}cargo/v1/supplier/create`, params);
}
// 发货单 编辑
export function getUpdate(params, id) {
    return http.putBody(`${resquest}cargo/v1/supplier/${id}/update`, params);
}

// 采购订单列表查询
export function getPurchaseList(params) {
    return http.get(`${resquest}purchase/v1/list`, params);
}
// 退货单导入模板
export function getDown(params) {
    return http.get(`${resquest}file-download/v1/files-anon/import-template`, params);
}
// 退货单导入模板
export function getFile(url) {
    return http.postFile(url, {});
}

// 获取拒绝原因列表
export function getReasonList(params) {
    return http.get(`${resquest}refuse-reason/v1/list`, params);
}
// 发货单状态校验
export function getCheckStatus(params) {
    return http.get(`${resquest}cargo/v1/check-status/${params.id}/${params.currentStatus}`, {});
}
// 到货单状态校验
export function getRCheckStatus(params) {
    return http.get(`${resquest}requirement/v1/check-status/${params.id}/${params.currentStatus}`, {});
}
// 退货单状态校验
export function getReCheckStatus(params) {
    return http.get(`${resquest}rejected/v1/check-status/${params.id}/${params.currentStatus}`, {});
}

// 收货单 收货
export function getTake(params) {
    return http.putBody(`${resquest}cargo/v1/buyer/${params.cargoId}/receive-cargo`, params);
}

//导出
export function handleExport(params) {
    return http.post(`${resquest}purchase/v1/export`, params);
}
//导入退货单
export const expImportReturnOrder = `${resquest}rejected/v1/buyer/import`;
