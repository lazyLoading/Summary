import http from "../utils/http";
// get请求
let resquest = process.env.VUE_APP_BASE_API;
/*
 **
 ** 获取登陆权限
 */
export function login(params) {
  return http.post(`${resquest}/user/v1/login`, params);
}
// 企业入驻申请
export function enterprise(params) {
  return http.post(`${resquest}enterprise-checkin/v1`, params);
}
// 退出登陆
export function logout(params) {
  return http.delete(`${resquest}/user/v1/logout`, params);
}
// 获取用户详细信息
export function getUserDetail(params) {
  return http.get(`${resquest}/user/v1/user-detail`, params);
}
//供应协同
export const supplyApi = {
  getDispatchBillQuery(params) {
    return http.get(`${resquest}cargo/v1/list`, params);
  }, //供应商发货通知单
  getPurchaseOrderQuery(params) {
    return http.get(`${resquest}purchase/v1/list`, params);
  }, //采购订单列表查询
  purchaseDownload(params) {
    return http.getFile(`${resquest}purchase/v1/${params.id}/download-file`);
  }, //采购订单列表-下载附件
  getArrivalNoticeQuery(params) {
    return http.get(`${resquest}requirement/v1/list`, params);
  }, //到货通知单查询
  getSalesReturnQuery(params) {
    return http.get(`${resquest}rejected/v1/list`, params);
  }, //退货单查询
  supplierdelivery(params) {
    return http.get(`${resquest}cargo/v1/buyer/statistics`, params);
  }, //客户发货统计列表 分页查询
  supplierdeliveryexport(params) {
    return http.postFile(
      `${resquest}cargo/v1/buyer/statistics/export`,
      params
    );
  }, //客户发货统计列表 导出EXCEL
  supplierdeliverydetail(params) {
    return http.get(`${resquest}cargo/v1/statistics/details`, params);
  }, //客户退货统计列表 详情
  supplierrejected(params) {
    return http.get(`${resquest}rejected/v1/buyer/statistics`, params);
  }, //客户退货统计列表 分页查询
  supplierstatisticsexport(params) {
    return http.postFile(
      `${resquest}rejected/v1/buyer/statistics/export`,
      params
    );
  }, //客户退货统计列表 导出EXCEL
  suppliercargo(params) {
    return http.get(`${resquest}rejected/v1/statistics/details`, params);
  }, //客户退货统计列表 详情
  supplierpurchase(params) {
    return http.get(`${resquest}purchase/v1/buyer/statistics`, params);
  }, //客户订单统计列表 分页查询
  supplierpurchaseexport(params) {
    return http.postFile(
      `${resquest}purchase/v1/buyer/statistics/export`,
      params
    );
  }, //客户订单统计列表 导出EXCEL
  supplierpurchasedetail(params) {
    return http.get(`${resquest}purchase/v1/statistics/details`, params);
  }, //客户订单统计列表 详情
  getPurchaserCompanyName(params) {
    return http.get(`${resquest}user-enterprise/v1/related-enterprise`, params);
  }, //生产计划与库存 获取关联的企业信息,客户名称
  getProductionQuery(params) {
    return http.post(`${resquest}production-plan/v1/query`, params);
  }, //生产计划与库存 查询生产计划
  getProductionAdd(params) {
    return http.post(`${resquest}production-plan/v1/save`, params);
  }, //生产计划与库存 新增生产计划
  getProductionEdit(params) {
    return http.post(`${resquest}production-plan/v1/update`, params);
  }, //生产计划与库存 编辑生产计划
  getEditMaterial(id) {
    return http.get(`${resquest}purchase/v1/${id}/material-list`);
  }, //生产计划与库存 编辑生产计划
  getProductionDel(params) {
    return http.get(`${resquest}production-plan/v1/delete`, params);
  }, //生产计划与库存 删除生产计划
  getInventoryQuery(params) {
    return http.post(`${resquest}material-storage/v1/query`, params);
  }, //生产计划与库存 查询库存
  getInventoryAdd(params) {
    return http.post(`${resquest}material-storage/v1/save`, params);
  }, //生产计划与库存 新增库存
  getInventoryEdit(params) {
    return http.post(`${resquest}material-storage/v1/update`, params);
  }, //生产计划与库存 编辑库存
  getInventoryDel(params) {
    return http.get(`${resquest}material-storage/v1/delete`, params);
  }, //生产计划与库存 删除库存
  getCompareList(params) {
    return http.get(`${resquest}compare/v1/list`, params);
  }, //对账单列表查询
  getCompareDetail(params) {
    return http.post(`${resquest}compare/v1/detail`, params);
  }, //对账单详情
  getRelatedEnterprise(params) {
    return http.get(`${resquest}user-enterprise/v1/related-enterprise`, params);
  }, //获取关联的企业信息
  getSentList(params) {
    return http.get(`${resquest}cargo/v1/selected-list`, params);
  }, //选择发货单列表 分页查询
  getReturnList(params) {
    return http.get(`${resquest}rejected/v1/selected-list`, params);
  }, //选择发货单列表 分页查询
  getUpdateStatus(params) {
    return http.post(`${resquest}compare/v1/batch-update-status`, params);
  }, //对账单状态修改/compare/v1/compare-code
  getCompareCode(params) {
    return http.get(`${resquest}compare/v1/compare-code`, params);
  }, //申请对账单号
  addNewCreate(params) {
    return http.post(`${resquest}compare/v1/create`, params);
  }, //新增对账单
  editCreate(params) {
    return http.post(`${resquest}compare/v1/update`, params);
  }, //编辑对账单
  getEnterpriselist(params) {
    return http.get(`${resquest}user-enterprise/v1/related-enterprise`, params);
  }, //获取企业列表
  getCheckStatus(params) {
    return http.get(
      `${resquest}compare/v1/check-status/${params.id}/${params.status}`
    );
  }, //点击状态确认
};

//采购协同
export const buyerApi = {
  getOrderQuery(params) {
    return http.get(`${resquest}purchase/v1/list`, params);
  }, //订单查询
  getArrivalNoticeQuery(params) {
    return http.get(`${resquest}requirement/v1/list`, params);
  }, //到货通知单查询
  getSalesReturnQuery(params) {
    return http.get(`${resquest}rejected/v1/list`, params);
  }, //退货单查询
  buyerdelivery(params) {
    return http.get(`${resquest}cargo/v1/supplier/statistics`, params);
  }, //客户发货统计列表 分页查询
  buyerdeliveryexport(params) {
    return http.postFile(`${resquest}cargo/v1/supplier/statistics/export`, params);
  }, //客户发货统计列表 导出EXCEL
  buyerrejected(params) {
    return http.get(`${resquest}rejected/v1/supplier/statistics`, params);
  }, //客户退货统计列表 分页查询
  buyerrejectedexport(params) {
    return http.postFile(
      `${resquest}rejected/v1/supplier/statistics/export`,
      params
    );
  }, //客户退货统计列表 导出EXCEL
  buyerpurchase(params) {
    return http.get(`${resquest}purchase/v1/supplier/statistics`, params);
  }, //客户订货统计列表 分页查询
  buyerpurchaseexport(params) {
    return http.postFile(
      `${resquest}purchase/v1/supplier/statistics/export`,
      params
    );
  }, //客户订货统计列表 导出EXCEL
  getReceivingQuery(params) {
    return http.get(`${resquest}cargo/v1/list`, params);
  }, //收货单列表
  rejectionList(params) {
    return http.get(`${resquest}refuse-reason/v1/list`, params);
  }, //收货单列表
};

// 权限中心
export const powerApi = {
  getEmployeeManageList(params) {
    return http.get(`${resquest}user/v1/list`, params);
  }, // 企业员工管理列表页
  changeEmployeeStatus(params) {
    return http.putBody(
      `${resquest}user/v1/${params.id}/update-status`,
      params
    );
  }, //列表启用禁用
  getAllRole(params) {
    return http.get(`${resquest}role/v1/list`, params);
  }, // 获取所有用户角色
  editEmployee(params) {
    return http.putBody(`${resquest}user/v1/${params.id}/update`, params);
  }, //列表启用禁用
  getAllRolePower(params) {
    return http.get(`${resquest}menu/v1/list`, params);
  }, //获取所有角色权限
  addRoleConfirm(params) {
    return http.post(`${resquest}role/v1/`, params);
  }, //确认添加角色
  deleteRole(params) {
    return http.delete(`${resquest}role/v1/${params.id}`, params);
  }, //删除角色
  editRole(params) {
    return http.putBody(`${resquest}role/v1/${params.id}`, params);
  }, //编辑角色
  getUserData(params) {
    return http.get(`${resquest}/user/v1/users/current-company`, params);
  }, //从制造云获取公司用户
  getUserList(params) {
    return http.get(`${resquest}/user/v1/sel-app-users`, params);
  }, //从制造云获取本公司的所有用户
  assignUser(params) {
    return http.post(
      `${resquest}/role/v1/${params.id}/assign-user`,
      params.list
    );
  }, // 授予用户新角色
  getInfoList(params) {
    return http.get(
      `${resquest}notice/v1/list/${params.pageNum}/${params.pageSize}`,
      {}
    );
  }, // 信息提示
  batchImportUser(params) {
    return http.post(`${resquest}user/v1/batch-import`, params);
  }, // 信息提示
};
