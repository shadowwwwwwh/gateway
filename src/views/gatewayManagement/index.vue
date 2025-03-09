<template>
  <div class="card content-box">
    <!-- 网关注册弹窗 -->
    <el-dialog v-model="dialogVisible" title="网关注册" width="600px" :close-on-click-modal="false">
      <el-form :model="gatewayForm" label-width="80px">
        <el-form-item label="网关名称" required>
          <el-input v-model="gatewayForm.name" placeholder="请输入网关名称" />
        </el-form-item>
        <el-form-item label="账号" required>
          <el-input v-model="gatewayForm.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="gatewayForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="使用方" required>
          <el-select v-model="gatewayForm.userCategory" placeholder="请选择">
            <el-option v-for="item in userCategories" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="saveGateway">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 独立按钮容器 -->
    <div class="action-bar">
      <el-button type="primary" @click="dialogVisible = true">网关注册</el-button>
    </div>
    <!-- 网关列表表格 -->
    <ProTable
      :columns="columns"
      :init-param="initParam"
      :data-callback="dataCallback"
      :request-api="getGatewayList"
      :table-search-props="tableSearchProps"
    >
      <!-- 新增搜索栏头部插槽 -->
      <template #table-header>
        <div class="table-header">
          <el-button type="primary" @click="dialogVisible = true">网关注册</el-button>
        </div>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="scope">
        <el-button type="primary" link @click="initPassword(scope.row)">初始化密码</el-button>
        <el-button type="danger" link @click="deleteGateway(scope.row.id)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ColumnProps } from "@/components/ProTable/interface";

// 网关相关状态
const dialogVisible = ref(false);
const gatewayForm = reactive({
  name: "",
  account: "",
  password: "",
  userCategory: ""
});

const userCategories = [
  { value: "dept1", label: "技术部" },
  { value: "dept2", label: "市场部" },
  { value: "dept3", label: "财务部" }
];

// 表格列配置
const columns = reactive<ColumnProps<any>[]>([
  { type: "index", label: "序号", width: 60 },
  { prop: "name", label: "网关名称", width: 120, search: { el: "input" } },
  { prop: "account", label: "账号", width: 150 },
  { prop: "userCategory", label: "使用方", width: 120 },
  { prop: "appCount", label: "应用数", width: 100 },
  { prop: "status", label: "状态", width: 100 },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    fixed: "right",
    slot: "operation"
  }
]);

// 模拟API
const getGatewayList = async () => {
  return {
    code: 200,
    data: {
      list: [
        {
          id: 1,
          name: "网关A",
          account: "gateway_a",
          userCategory: "技术部",
          appCount: 5,
          status: "已启用"
        },
        {
          id: 2,
          name: "网关B",
          account: "gateway_b",
          userCategory: "市场部",
          appCount: 3,
          status: "已停用"
        }
      ],
      total: 2
    }
  };
};

// 保存网关
const saveGateway = async () => {
  try {
    if (!gatewayForm.name || !gatewayForm.account || !gatewayForm.password || !gatewayForm.userCategory) {
      ElMessage.warning("请填写完整的网关信息");
      return;
    }

    // 这里调用注册API
    ElMessage.success("注册成功");
    dialogVisible.value = false;
    Object.assign(gatewayForm, {
      name: "",
      account: "",
      password: "",
      userCategory: ""
    });
  } catch (error) {
    ElMessage.error("注册失败");
  }
};

// 初始化密码
const initPassword = (row: any) => {
  ElMessageBox.confirm(`确定要初始化【${row.name}】的密码吗？`, "提示", {
    type: "warning"
  })
    .then(() => {
      ElMessage.success("密码已初始化");
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {
    });
};

// 删除网关
const deleteGateway = (id: number) => {
  console.log(id);
  ElMessageBox.confirm("确定要删除该网关吗？", "提示", {
    type: "warning"
  }).then(() => {
    ElMessage.success("删除成功");
  }).catch(() => {
  });
};

// 其他原有逻辑
const initParam = reactive({});
const dataCallback = (data: any) => ({ list: data.list, total: data.total });
const onReset = () => ElMessage.success("已重置搜索条件");
const tableSearchProps = reactive({ style: { width: "100%" } });
const cancel = () => {
  dialogVisible.value = false;
  Object.assign(gatewayForm, {
    name: "",
    account: "",
    password: "",
    userCategory: ""
  });
};
</script>

<style scoped lang="less">
.action-bar {
  margin-bottom: 16px;
  text-align: right;

  .el-button {
    width: 120px;
    height: 36px;
    font-size: 14px;
  }
}

/* 强制确保表格宽度 */
:deep(.pro-table) {
  width: 100% !important;

  .el-table {
    width: 100% !important;
  }
}
</style>
