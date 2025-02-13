// Controlled-Sharing-Fronted/src/api/modules/strategy.ts
import axios from 'axios';

// 获取策略列表
export const getStrategyList = async (params: any) => {
  const response = await axios.get('/api/strategy/list', { params });
  return response.data;
};
