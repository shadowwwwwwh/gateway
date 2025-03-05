// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageIndex: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    captcha: string;
  }
  export interface ResLogin {
    statusCode: number;
    statusContent: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}
//应用注册
export namespace App {
  export interface ReqApplication {
    ApplicationName: string;
    Domain: string;
    Department: string;
    Responsible: string;
    AppId?: string;
    AppKey?: string;
  }
  export interface ResApplicationInfoList {
    appInfo: ReqApplication[];
    success: boolean;
  }
  export interface ResAttribute {
    attributeInfo: ResAttributeInfo[];
    total: number;
    success: boolean;
  }
  export interface ResAttributeInfo {
    Name: string;
    Attribute: string;
    Occupation?: string;
  }
  export interface ReqAttribute {
    userName: string;
    userAttribute?: string;
    userOccupation?: string;
    useDepartment?: string;
  }
  export interface ReqApplicationInfo {
    pageIndex: number;
    pageSize: number;
  }
  export interface ReqApplicationUpdate {
    applicationName_old: string;
    applicationName: string;
    businessDomain: string;
    businessUnit: string;
    manager: string;
  }
  export interface ReqApplicationRegister {
    applicationName: string;
    businessDomain: string;
    businessUnit: string;
    manager: string;
  }
  export interface ResApplicationInfo {
    statusCode: number;
    statusContent: string;
    appInfo?: {
      applicationName: string;
      businessDomain: string;
      businessUnit: string;
      manager: string;
    };
    applicationIdentification?: string;
    applicationSecrectKey?: string;
  }
  export interface ResAppToken {
    statusCode: number;
    statusContent: string;
    appId: string;
    appKey: string;
  }
}
