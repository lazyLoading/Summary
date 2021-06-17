/*订单详情*/

import http from "../utils/http";
// get请求
let resquest = process.env.VUE_APP_BASE_API;

//上传
export const upFiles = `${resquest}file-upload/v1/files`;

//导入
export const expImport = `${resquest}purchase/v1/expImport`;

//导入到货通知单
export const expRImport = `${resquest}requirement/v1/expImport`;

//列表
export function purchaseList(params) {
    return http.get(`${resquest}purchase/v1/list`, params);
}
//详情
export function purchaseDetail(params) {
    return http.get(`${resquest}purchase/v1/${params.id}/detail`);
}

//新增
export function purchaseAdd(params) {
    return http.post(`${resquest}purchase/v1/create`, params);
}
//更新
export function purchaseUpdate(params) {
    return http.post(`${resquest}purchase/v1/update`, params);
}

//操作-下发|删除
export function purchaseOperationUpdate(params) {
    return http.post(`${resquest}purchase/v1/batch-update-status`, params);
}

//下载模板
export function importTemplate(params) {
    return http.get(
        `${resquest}file-download/v1/files-anon/import-template`,
        params
    );
}

//供应商列表
export function purchaseRelated(params) {
    return http.get(`${resquest}user-enterprise/v1/related-enterprise`, params);
}
//导出
export function purchaseExport(params) {
    return http.postFile(`${resquest}purchase/v1/export`, params);
}
//批量导出
export function batchExport(params) {
    return http.getFile(`${resquest}purchase/v1/batch-export`, params);
}
//下载附件
export function purchaseDownload(id) {
    return http.getFile(`${resquest}purchase/v1/${id}/download-file`);
}

//状态校验
export function purchaseCurrentStatus(params) {
    return http.get(`${resquest}purchase/v1/check-status/${params.id}/${params.currentStatus}`);
}