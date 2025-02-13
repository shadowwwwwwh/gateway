<template>
  <div class="card content-box">
    <!-- 将策略注册按钮放在右上角 -->
    <div style="text-align: right; margin-bottom: 10px;">
      <el-button type="primary" @click="onRegisterStrategy">策略注册</el-button>
    </div>
    <ProTable
      :columns="columns"
      :init-param="initParam"
      :data-callback="dataCallback"
      :request-api="getStrategyList"
      :table-search-props="tableSearchProps"
    >
      <template #table-search-buttons>
        <el-button @click="onReset">重置</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="strategyManagement">
import { ref, reactive } from 'vue';
import ProTable from "@/components/ProTable/index.vue";
import { getStrategyList } from '@/api/modules/strategy'; // 假设获取策略列表的 API 接口
import { ElMessage } from 'element-plus';
import { ColumnProps } from "@/components/ProTable/interface";

// 表格配置项
const columns = reactive<ColumnProps<any>[]>([
  { type: 'index', label: '序号', width: 80 },
  { prop: 'strategyName', label: '策略名称', width: 120 },
  { prop: 'dataProvider', label: '数据提供方', width: 120 },
  { prop: 'strategyCode', label: '策略码', width: 120, search: { el: 'input' } },
  { prop: 'registerTime', label: '注册时间', width: 180 },
  { prop: 'validityPeriod', label: '有效期', width: 180 },
  { prop: 'status', label: '状态', width: 120 },
  { prop: 'operation', label: '操作', width: 330, fixed: 'right' }
]);

// 如果表格需要初始化请求参数，直接定义传给 ProTable
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 重置搜索条件
const onReset = () => {
  // 重置搜索条件的逻辑
  ElMessage.success('已重置搜索条件');
};

// 策略注册按钮点击事件
const onRegisterStrategy = () => {
  // 跳转到策略注册页面或打开注册弹窗的逻辑
  ElMessage.success('点击了策略注册按钮');
};

// 让 table-search 宽度和表格宽度一样
const tableSearchProps = reactive({
  style: { width: '100%' }
});
</script>

<style scoped lang="less"></style>
