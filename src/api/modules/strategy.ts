// Controlled-Sharing-Fronted/src/api/modules/strategy.ts
import axios from "axios";

// 获取策略列表
// export const getStrategyList = async (params: any) => {
//   const response = await axios.get("/api/strategy/list", { params });
//   return response.data;
// };

// src/api/modules/strategy.ts
export const getStrategyList = async (params: any) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 11));
  console.log(params);
  // 返回测试数据
  return {
    code: 200,
    message: "success",
    data: {
      list: [
        {
          id: 1,
          strategyName: "量化策略A",
          dataProvider: "提供方一",
          strategyCode: "STR-001",
          registerTime: "2023-08-01 10:00:00",
          validityPeriod: "30天",
          status: "已生效"
        },
        {
          id: 2,
          strategyName: "风险控制B",
          dataProvider: "提供方二",
          strategyCode: "STR-002",
          registerTime: "2023-08-02 14:30:00",
          validityPeriod: "90天",
          status: "待审核"
        },
        {
          id: 3,
          strategyName: "套利策略C",
          dataProvider: "提供方一",
          strategyCode: "STR-003",
          registerTime: "2023-08-03 09:15:00",
          validityPeriod: "180天",
          status: "已过期"
        }
      ],
      total: 3
    }
  };
};
export const registerStrategies = async (params: any) => {
  const response = await axios.get("/api/strategy/register", { params });
  return response.data;
};
