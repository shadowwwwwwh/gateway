<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getAttributeInfo" :data-callback="dataCallback">
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="getSecret(scope.row)">密钥获取</el-button>
      </template>
    </ProTable>
    <AppRefresh ref="appRefreshRef" />
    <AppRegister ref="appRegisterRef" />
    <TokenRefresh ref="checkTokenRef" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue";
import {App, Gateway} from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import AppRefresh from "@/views/table/appTable/appRefresh.vue";
import AppRegister from "@/views/table/appTable/appRegister.vue";
import TokenRefresh from "@/views/table/appTable/tokenRefresh.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import {getSecretKey,getAttributeInfo} from "@/api/modules/gateway";
import {useUserStore} from "@/stores/modules/user";

// ProTable 实例
const proTable = ref<ProTableInstance>();
const userStore = useUserStore();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
//const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  console.log("data", data);
  return {
    list: data.list,
    total: data.total
  };
};

// 表格配置项
const columns = reactive<ColumnProps<Gateway.ResGatewayInfo>[]>([
  {
    type: "index",
    label: "序号",
    width: 60
  },
  {
    prop: "Name",
    label: "用户名称"
    // search: { el: "input" }
  },
  {
    prop: "Attribute",
    label: "用户属性",
  },
  {
    prop: "Occupation",
    label: "用户归口"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);
//获取密钥
const getSecret = async (row: Partial<Gateway.ResGatewayInfo> = {}) => {
  const account = userStore.userInfo.name;
  const params = {
    userAttribute: row.Attribute,
    account: account
  };
  try {
    const secretKey = await getSecretKey(params);
    console.log("密钥", secretKey);
    // 创建一个 Blob 对象
    const blob = new Blob([secretKey], { type: 'application/x-pem-file' });

    // 创建一个临时的 <a> 元素
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${account}_secret_key.pem`;

    // 模拟点击链接来触发下载
    link.click();

    // 释放 URL 对象
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('下载密钥文件时出错:', error);
  }
};
// 删除用户信息

</script>
