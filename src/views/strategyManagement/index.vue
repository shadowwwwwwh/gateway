<template>
  <div class="card content-box">
    <!-- 策略注册按钮 -->
    <div style="text-align: right; margin-bottom: 10px">
      <el-button type="primary" @click="dialogVisible = true">策略注册</el-button>
    </div>

    <!-- 策略注册弹窗 -->
    <el-dialog v-model="dialogVisible" width="800px" :close-on-click-modal="false" class="strategy-dialog">
      <!-- 自定义标题 -->
      <template #header>
        <div class="dialog-header">
          <span class="el-dialog__title">策略注册</span>
        </div>
      </template>

      <!-- 弹窗内容 -->
      <div class="dialog-content">
        <!-- 策略信息输入 -->
        <el-form :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="策略名称">
                <el-input v-model="form.strategyName" placeholder="请输入策略名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据提供方">
                <el-select v-model="form.dataProvider" placeholder="请选择">
                  <el-option v-for="item in dataProviders" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效期">
                <el-select v-model="form.validityPeriod" placeholder="请选择">
                  <el-option v-for="item in validityPeriods" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="addStrategy">添加策略</el-button>
        </div>

        <!-- 待注册策略列表 -->
        <el-table :data="pendingStrategies" border style="width: 100%">
          <el-table-column prop="strategyName" label="策略名称" width="180" />
          <el-table-column prop="dataProvider" label="数据提供方" width="180" />
          <el-table-column prop="validityPeriod" label="有效期" />
          <el-table-column label="操作" width="100">
            <template #default="{ $index }">
              <el-button link type="danger" @click="removeStrategy($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 弹窗底部 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 策略详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="策略明细" width="1000px" :close-on-click-modal="false">
      <el-table :data="detailData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="dataUser" label="数据使用方" width="180" />
        <el-table-column prop="userCategory" label="用户归口" width="180" />
        <el-table-column prop="accessFields" label="访问字段" />
        <el-table-column prop="dataProvider" label="数据提供方" width="180" />
      </el-table>
    </el-dialog>

    <!-- 策略列表表格 -->
    <ProTable
      :columns="columns"
      :init-param="initParam"
      :data-callback="dataCallback"
      :request-api="getStrategyList"
      :table-search-props="tableSearchProps"
    >
      <template #operation="scope">
        <el-button type="primary" link @click="showDetail(scope.row)">查看详情</el-button>
        <el-button type="danger" link @click="invalidStrategy(scope.row.id)">作废</el-button>
      </template>
      <template #table-search-buttons>
        <el-button @click="onReset">重置</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ColumnProps } from "@/components/ProTable/interface";
import axios from "axios";

// 详情状态
const detailDialogVisible = ref(false);
const detailData = ref<any[]>([]);

// 弹窗状态
const dialogVisible = ref(false);
// 表单数据
const form = reactive({
  strategyName: "",
  dataProvider: "",
  validityPeriod: ""
});
// 待注册策略列表
const pendingStrategies = reactive<any[]>([]);

// 下拉选项
const dataProviders = ref<any[]>([]);

const validityPeriods = [
  { value: "30", label: "30天" },
  { value: "90", label: "90天" },
  { value: "180", label: "180天" }
];

// 添加策略
const addStrategy = () => {
  if (!form.strategyName || !form.dataProvider || !form.validityPeriod) {
    ElMessage.warning("请填写完整的策略信息");
    return;
  }

  pendingStrategies.push({ ...form });
  form.strategyName = "";
  form.dataProvider = "";
  form.validityPeriod = "";
};

// 删除策略
const removeStrategy = (index: number) => {
  pendingStrategies.splice(index, 1);
};

// 保存策略
const save = async () => {
  try {
    if (pendingStrategies.length === 0) {
      ElMessage.warning("请先添加策略");
      return;
    }

    const policies = pendingStrategies.map(strategy => ({
      policyName: strategy.strategyName,
      dataOwner: strategy.dataProvider,
      lifespan: strategy.validityPeriod === "30" ? "30天" : strategy.validityPeriod === "90" ? "90天" : "180天",
      policyInfo: [] // 这里根据实际情况补充 policyInfo
    }));

    await axios.post("http://localhost:30075/api/policy/register", policies, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    ElMessage.success("策略注册成功");
    dialogVisible.value = false;
    pendingStrategies.splice(0, pendingStrategies.length);
    // 刷新策略列表
    getStrategyList();
  } catch (error) {
    ElMessage.error("策略注册失败");
  }
};

// 取消
const cancel = () => {
  dialogVisible.value = false;
  pendingStrategies.splice(0, pendingStrategies.length);
};

// 查看详情方法
const showDetail = async (row: any) => {
  try {
    const response = await axios.post(
      "http://localhost:30075/api/policy/detail",
      {
        policyCode: row.strategyCode
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    detailData.value = response.data;
    detailDialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取策略详情失败");
  }
};

// 作废方法
const invalidStrategy = async (id: number) => {
  ElMessageBox.confirm("确认要作废该策略吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        await axios.post(
          "http://localhost:30075/api/policy/abort",
          {
            policyCode: id
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        ElMessage.success("作废成功");
        // 刷新策略列表
        getStrategyList();
      } catch (error) {
        ElMessage.error("作废策略失败");
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};

// 原有表格配置保持不变
const columns = reactive<ColumnProps<any>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "strategyName", label: "策略名称", width: 120 },
  { prop: "dataProvider", label: "数据提供方", width: 120 },
  {
    prop: "strategyCode",
    label: "策略码",
    width: 120,
    search: { el: "input" } // 保留搜索功能
  },
  { prop: "registerTime", label: "注册时间", width: 180 },
  { prop: "validityPeriod", label: "有效期", width: 180 },
  { prop: "status", label: "状态", width: 120 },
  { prop: "operation", label: "操作", width: 330, fixed: "right", slot: "operation" }
]);

const initParam = reactive({
  pageIndex: 1,
  pageSize: 5
});
const dataCallback = (data: any) => ({ list: data.list, total: data.total });
const onReset = () => ElMessage.success("已重置搜索条件");
const tableSearchProps = reactive({ style: { width: "100%" } });

// 获取策略列表
const getStrategyList = async () => {
  try {
    const response = await axios.post("http://localhost:30075/api/policy/getPolicyInfo", initParam, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    ElMessage.error("获取策略列表失败");
    return { list: [], total: 0 };
  }
};

// 获取数据提供方
const fetchDataProviders = async () => {
  try {
    const response = await axios.get("http://localhost:30075/api/policy/getUserInfo");
    dataProviders.value = response.data.map(item => ({ value: item.id, label: item.name })); // 假设返回的数据有id和name字段
  } catch (error) {
    ElMessage.error("获取数据提供方失败");
  }
};

onMounted(() => {
  fetchDataProviders();
});
</script>

<style scoped lang="less">
.dialog-header {
  text-align: center;
  font-weight: bold;
}

.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}

.strategy-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }

  .el-dialog__body {
    padding: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
/* 按钮间距 */
.el-button + .el-button {
  margin-left: 8px;
}

/* 详情表格样式 */
.el-table {
  margin: 10px 0;

  :deep(.el-table__header) th {
    background-color: #f5f7fa;
  }
}

/* 弹窗标题居中 */
:deep(.el-dialog__header) {
  text-align: center;
  border-bottom: 1px solid #eee;
}

/* 弹窗底部按钮 */
:deep(.el-dialog__footer) {
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
