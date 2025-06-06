import { ResPage, Gateway ,App} from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import axios from "axios";

//应用信息
export const getAppInfoOnly = (params: App.ReqApplicationInfo) => {
  return axios
    .post<App.ResApplicationInfoList>(`api/application/getAppInfo`, params)
    .then(response => {
      const newRes = {
        data: {
          list: response.data.appInfo,
          total: response.data.totalCount
        },
        success: true
      };
      return newRes;
    })
    .catch(error => {
      throw error;
    });
};
//应用注册
export const getApplicationRegister = (params: App.ReqApplicationRegister) => {
  return axios
    .post<App.ResApplicationInfo>(`/api/application/register`, params)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};
//应用令牌
export const getApplicationToken = async applicationName => {
  try {
    const params = { applicationName: applicationName };
    const res = await axios.post<App.ResAppToken>(`/api/application/getToken`, params);
    const newRes = {
      appId: res.data.appId,
      appKey: res.data.appKey
    };
    return newRes;
  } catch (e) {
    console.log(e);
  }
};
///令牌更新
export const getTokenUpdate = async applicationName => {
  try {
    const params = { applicationName: applicationName };
    const res = await axios.post<App.ResApplicationInfo>(
      `/api/application/tokenUpdate
`,
      params
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
//应用更新
export const getApplicationUpdate = async (params: App.ReqApplicationUpdate) => {
  try {
    const res = await axios.post<App.ResApplicationInfo>(
      `/api/application/update
`,
      params
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
//应用删除
export const getApplicationDelete = (params: { applicationName: string }) => {
  return axios
    .post<App.ResApplicationInfo>(`/api/application/delete`, params)
    .then(response => {
      const data = response.data;
      // 检查响应状态码
      if (data.statusCode === 200) {
        // 状态码为 200 时返回响应数据
        return data;
      } else {
        // 状态码不为 200 时抛出错误
        throw new Error(`请求失败，状态码: ${data.statusCode}, 内容: ${data.statusContent}`);
      }
    })
    .catch(error => {
      // 捕获请求过程中的错误
      console.error("删除应用时发生错误:", error);
      // 重新抛出错误，方便调用者处理
      throw error;
    });
};
//获取密钥
export const getSecretKey = (params: Gateway.ReqGetSecretKey) => {
  return axios
    .post<Gateway.ResGetSecretKey>(`/api/gateway/getSecretKey`, params)
    .then(response => {
      const data = response.data;
      // 检查响应状态码
      return data;
    })
    .catch(error => {
      // 捕获请求过程中的错误
      console.error("获取密钥时发生错误:", error);
      // 重新抛出错误，方便调用者处理
      throw error;
    });
};
//获取密钥列表
export const getAttributeInfo = (params: Gateway.ReqGatewayParams) => {
  return axios
    .post<Gateway.ResGatewayList>(`/api/gateway/getAttributeInfo`, params)
    .then(response => {
      const data = response.data;
      // 检查响应状态码
      if (data.statusCode === 200) {
        // 状态码为 200 时返回响应数据
        const newRes = {
          data: {
            list: data.attributeInfo,
            total: data.totalCount
          },
          success: true
        };
        return newRes;
      } else {
        // 状态码不为 200 时抛出错误
        throw new Error(`请求失败，状态码: ${data.statusCode}, 内容: ${data.statusContent}`);
      }
    })
    .catch(error => {
      // 捕获请求过程中的错误
      console.error("获取密钥时发生错误:", error);
      // 重新抛出错误，方便调用者处理
      throw error;
    });
};
