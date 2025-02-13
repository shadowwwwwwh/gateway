<!-- Controlled-Sharing-Fronted/src/views/strategyManagement/index.vue -->
<template>
  <div class="card content-box">
    <ProTable
      :columns="columns"
      :init-param="initParam"
      :data-callback="dataCallback"
      :request-api="getStrategyList"
    />
  </div>
</template>

<script setup lang="ts" name="strategyManagement">
import { ref, reactive } from 'vue';
import ProTable from "@/components/ProTable/index.vue";
import { getStrategyList } from '@/api/modules/strategy';
import { ColumnProps } from "@/components/ProTable/interface"; // 假设获取策略列表的 API 接口

// 表格配置项
const columns = reactive<ColumnProps<any>[]>([
  { type: 'index', label: '序号', width: 80 },
  { prop: 'strategyName', label: '策略名称', width: 120, search: { el: 'input' } },
  { prop: 'dataProvider', label: '数据提供方', width: 120 },
  { prop: 'strategyCode', label: '策略码', width: 120 },
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

// 获取策略列表的 API 请求
// const getStrategyList = async (params: any) => {
//   // 这里可以调用后端接口获取策略列表数据
//   // 示例：const response = await axios.get('/api/strategy/list', { params });
//   // return response.data;
//   // 这里暂时返回模拟数据
//   return {
//     list: [],
//     total: 0
//   };
// };
</script>

<style scoped lang="less"></style>
