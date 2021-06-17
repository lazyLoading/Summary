import axios from "axios";
import qs from "qs";
import router from "../router";
import { Message } from "element-ui";
import { logout } from "@/api/user";

axios.defaults.timeout = 30000;
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;

// 请求 拦截
axios.interceptors.request.use(
  (config) => {
    //只针对get方式进行序列化
    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    config.headers["direction"] =
      localStorage.getItem("types") == "supplier"
        ? "supplier"
        : localStorage.getItem("types") == "procurement"
        ? "buyer"
        : "";
    config.headers["jwt-token"] = localStorage.getItem("jwt-token")
      ? localStorage.getItem("jwt-token")
      : "";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// 响应 拦截
axios.interceptors.response.use(
  (response) => {
    if (response.headers["jwt-token"]) {
      localStorage.setItem("jwt-token", response.headers["jwt-token"]);
    }
    //return response.data;
    switch (response.data.code) {
      case 401:
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("menu");
        localStorage.removeItem("types");
        localStorage.removeItem("jwt-token");
        router.push({ path: "/login" });
        Message.error(response.data.message);
        break;
      case 500:
        Message.error(response.data.message);
        break;
      default:
    }
    return response;
  },
  (error) => {
    // 异常处理
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes("timeout")) {
        Message.error("服务器响应超时，请刷新当前页");
      }
      // error.message("连接服务器失败");
    }

    // Message.error(error.message);
    /***** 处理结束 *****/
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.reject(error);
  }
);
const http = {
  /**
   * methods: 请求
   * @param url 请求地址
   * @param params 请求参数
   */
  get(url, params) {
    const config = {
      method: "get",
      url: url,
    };
    if (params) config.params = params;
    return axios(config);
  },
  getFile(url, params) {
    const config = {
      method: "get",
      url: url,
      responseType: "blob",
    };
    if (params) config.params = params;
    return axios(config);
  },
  post(url, params) {
    const config = {
      method: "post",
      url: url,
    };
    if (params) config.data = params;
    return axios(config);
  },
  postFile(url, params) {
    const config = {
      method: "post",
      url: url,
      responseType: "blob",
    };
    if (params) config.data = params;
    return axios(config);
  },
  put(url, params) {
    const config = {
      method: "put",
      url: url,
    };
    if (params) config.data = params;
    return axios(config);
  },
  putBody(url, params) {
    const config = {
      method: "put",
      url: url,
    };
    if (params) config.data = params;
    return axios(config);
  },
  delete(url, params) {
    const config = {
      method: "delete",
      url: url,
    };
    if (params) config.params = params;
    return axios(config);
  },
  deleteData(url, params) {
    const config = {
      method: "delete",
      url: url,
    };
    if (params) config.data = params;
    return axios(config);
  },
};
export default http;
