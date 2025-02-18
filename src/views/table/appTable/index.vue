<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getUserList" :init-param="initParam" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="appRegister()">应用注册</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="checkToken(scope.row)">令牌</el-button>
        <el-button type="primary" link :icon="EditPen" @click="appRefresh(scope.row)">更新</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <AppRefresh ref="appRefreshRef" />
    <AppRegister ref="appRegisterRef" />
    <TokenRefresh ref="checkTokenRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { App } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import AppRefresh from "@/views/table/appTable/appRefresh.vue";
import AppRegister from "@/views/table/appTable/appRegister.vue";
import TokenRefresh from "@/views/table/appTable/tokenRefresh.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { getUserList, deleteUser, getTokenUpdate, getApplicationRegister } from "@/api/modules/user";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 表格配置项
const columns = reactive<ColumnProps<App.ReqApplication>[]>([
  {
    prop: "sort",
    label: "序号"
  },
  {
    prop: "applicationName",
    label: "应用名",
    search: { el: "input" }
  },
  {
    prop: "businessDomain",
    label: "业务域"
  },
  {
    prop: "businessUnit",
    label: "业务部门"
  },
  {
    prop: "manager",
    label: "责任人"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 删除用户信息
const deleteAccount = async (params: App.ReqApplication) => {
  await useHandleData(deleteUser, { applicationName: [params.applicationName] }, `删除【${params.applicationName}】用户`);
  proTable.value?.getTableList();
};
const checkTokenRef = ref<InstanceType<typeof TokenRefresh> | null>(null);
const checkToken = (row: Partial<App.ReqApplication> = {}) => {
  const params = {
    isView: true,
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  checkTokenRef.value?.acceptParams(params);
};
const appRefreshRef = ref<InstanceType<typeof AppRefresh> | null>(null);
const appRefresh = (row: Partial<App.ReqApplication> = {}) => {
  const params = {
    isView: false,
    row: { ...row },
    api: getTokenUpdate,
    getTableList: proTable.value?.getTableList
  };
  appRefreshRef.value?.acceptParams(params);
};
const appRegisterRef = ref<InstanceType<typeof AppRegister> | null>(null);
const appRegister = () => {
  const params = {
    isView: false,
    api: getApplicationRegister,
    getTableList: proTable.value?.getTableList
  };
  appRegisterRef.value?.acceptParams(params);
};
</script>
