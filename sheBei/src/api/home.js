/*首页*/

import http from "../utils/http";
// get请求
let resquest = process.env.VUE_APP_BASE_API;

//模糊搜索
export function byName(params) {
  return http.get(`${resquest}enterprise/v1/by-name`, params);
}

//业务|订单
export function dataHome(params) {
  return http.get(`${resquest}home/v1/home-data`, params);
}
