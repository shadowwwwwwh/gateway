import { ResPage, User, App } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import axios from "axios";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/add`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/edit`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.post(PORT1 + `/user/delete`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
//应用信息
export const getAppInfoOnly = (params: App.ReqApplicationInfo) => {
  return axios
    .post<App.ResApplicationInfoList>(`api/application/getAppInfo`, params)
    .then(response => {
      const newRes = {
        data: {
          list: response.data.appInfo,
          total: response.data.appInfo.length
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
  console.log("params", params);
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
// 属性列表
export const getAttributeList = (params: App.ReqApplicationInfo) => {
  return axios
    .post<App.ResAttribute>(
      `/api/attribute/getAttributeInfo
`,
      params
    )
    .then(res => {
      const newRes = {
        data: {
          list: res.data.attributeInfo,
          total: res.data.attributeInfo.length
        },
        success: true
      };
      console.log("newRes", newRes);
      return newRes;
    })
    .catch(error => {
      console.log(error);
    });
};
// 属性注册
export const getAttributeRegister = (params: App.ReqAttribute) => {
  return axios
    .post<App.ReqAttribute>(`/api/attribute/register`, params)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.log(error);
    });
};
// 属性更新
export const getAttributeUpdate = (params: App.ReqAttribute) => {
  return axios
    .post<App.ReqAttribute>(`/api/attribute/update`, params)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.log(error);
    });
};
// 属性删除
export const getAttributeDelete = (params: App.ReqAttribute) => {
  return axios
    .post<App.ReqAttribute>(`/api/attribute/delete`, params)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.log(error);
    });
};
