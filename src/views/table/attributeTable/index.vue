<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getAttributeList" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="attributeRegister()">属性注册</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="attributeRefresh(scope.row)">更新</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <AttributeRefresh ref="attributeRefreshRef" />
    <AttributeRegister ref="attributeRegisterRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { App } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import AttributeRefresh from "@/views/table/attributeTable/attributeRefresh.vue";
import AttributeRegister from "@/views/table/attributeTable/attributeRegister.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { getAttributeList, getAttributeDelete, getAttributeRegister, getAttributeUpdate } from "@/api/modules/user";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
//const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 表格配置项
const columns = reactive<ColumnProps<App.ResAttributeInfo>[]>([
  {
    type: "index",
    label: "序号",
    width: 60
  },
  {
    prop: "Name",
    label: "用户名",
    search: { el: "input" }
  },
  {
    prop: "Attribute",
    label: "用户属性"
  },
  {
    prop: "Occupation",
    label: "用户归口"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 删除用户信息
const deleteAccount = async (params: App.ResAttributeInfo) => {
  try {
    // 构建传递给 getAttributeDelete 的参数
    const param = {
      userName: params.Name,
      userOccupation: params.Occupation
    };

    // 调用 useHandleData 函数进行删除操作
    await useHandleData(getAttributeDelete, param, `删除【${params.Name}】用户`);

    // 操作成功后重新加载表格数据
    if (proTable.value) {
      await proTable.value.getTableList();
    }
  } catch (error) {
    console.error("删除用户时出现错误:", error);
    // 可以在这里添加更多的错误处理逻辑，比如显示错误提示框等
  }
};
//属性更新
const attributeRefreshRef = ref<InstanceType<typeof AttributeRefresh> | null>(null);
const attributeRefresh = (row: Partial<App.ResAttributeInfo> = {}) => {
  const params = {
    isView: false,
    row: { ...row },
    api: getAttributeUpdate,
    getTableList: proTable.value?.getTableList
  };
  attributeRefreshRef.value?.acceptParams(params);
};
//属性注册
const attributeRegisterRef = ref<InstanceType<typeof AttributeRegister> | null>(null);
const attributeRegister = () => {
  const params = {
    isView: false,
    api: getAttributeRegister,
    getTableList: proTable.value?.getTableList
  };
  attributeRegisterRef.value?.acceptParams(params);
};
</script>
