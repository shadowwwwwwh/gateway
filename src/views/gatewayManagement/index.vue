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
        <el-button type="danger" link @click="deleteGateway(scope.row)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ColumnProps } from "@/components/ProTable/interface";
import axios from "axios";

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
  { prop: "gatewayName", label: "网关名称" },
  { prop: "account", label: "账号" },
  { prop: "user", label: "使用方" },
  { prop: "applicationNum", label: "应用数" },
  { prop: "gatewayStatus", label: "状态" },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    fixed: "right",
    slot: "operation"
  }
]);

// 获取网关列表
const getGatewayList = async (params: any) => {
  try {
    const response = await axios.post("/api/gateway/getGatewayInfo", {
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 3
    });
    console.log("response", response.data.gatewayInfo);
    return {
      code: response.data.statusCode,
      data: {
        list: response.data.gatewayInfo,
        total: response.data.gatewayInfo.length // 假设返回的列表长度就是总数，实际情况可能需要调整
      }
    };
  } catch (error) {
    ElMessage.error("获取网关列表失败");
    return {
      code: 500,
      data: {
        list: [],
        total: 0
      }
    };
  }
};

// 保存网关
const saveGateway = async () => {
  try {
    if (!gatewayForm.name || !gatewayForm.account || !gatewayForm.password || !gatewayForm.userCategory) {
      ElMessage.warning("请填写完整的网关信息");
      return;
    }

    const dataUser = userCategories.find(item => item.value === gatewayForm.userCategory)?.label;
    const response = await axios.post("/api/gateway/register", {
      gatewayname: gatewayForm.name,
      account: gatewayForm.account,
      password: gatewayForm.password,
      dataUser
    });

    if (response.data.code === 200) {
      ElMessage.success("注册成功");
      dialogVisible.value = false;
      Object.assign(gatewayForm, {
        name: "",
        account: "",
        password: "",
        userCategory: ""
      });
    } else {
      ElMessage.error("注册失败");
    }
  } catch (error) {
    ElMessage.error("注册失败");
  }
};

// 初始化密码
const initPassword = async (row: any) => {
  ElMessageBox.confirm(`确定要初始化【${row.gatewayName}】的密码吗？`, "提示", {
    type: "warning"
  })
    .then(async () => {
      try {
        const response = await axios.post("/api/gateway/initPwd", {
          gatewayName: row.gatewayName,
          account: row.account
        });

        if (response.data.code === 200) {
          ElMessage.success("密码已初始化");
        } else {
          ElMessage.error("密码初始化失败");
        }
      } catch (error) {
        ElMessage.error("密码初始化失败");
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};

// 删除网关
const deleteGateway = async (row: any) => {
  ElMessageBox.confirm("确定要删除该网关吗？", "提示", {
    type: "warning"
  })
    .then(async () => {
      try {
        const response = await axios.post("/api/gateway/delete", {
          gatewayName: row.gatewayName,
          account: row.account
        });

        if (response.data.code === 200) {
          ElMessage.success("删除成功");
        } else {
          ElMessage.error("删除失败");
        }
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};

// 其他原有逻辑
const initParam = reactive({});
const dataCallback = (data: any) => ({ list: data.list, total: data.total });
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

<style scoped lang="scss">
.action-bar {
  margin-bottom: 16px;
  text-align: right;

  .el-button {
    width: 120px;
    height: 36px;
    font-size: 14px;
  }
}
</style>
