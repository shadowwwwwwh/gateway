<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" size="250px" title="准入令牌">
    <el-form label-width="100px" label-suffix=" :" :disabled="drawerProps.isView" :model="tokenProps">
      <el-form-item label="应用标识">
        <el-input v-model="tokenProps.applicationIdentification" clearable></el-input>
      </el-form-item>
      <el-form-item label="应用密钥">
        <el-input v-model="tokenProps.applicationSecrectKey" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TokenRefresh">
import { onMounted, ref } from "vue";
import { App } from "@/api/interface";
import { getApplicationToken, getTokenUpdate } from "@/api/modules/user";

interface DrawerProps {
  isView: boolean;
  row: Partial<App.ReqApplication>;
  getTableList?: () => void;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: true,
  row: {}
});
interface TokenProps {
  applicationIdentification: string;
  applicationSecrectKey: string;
}
const tokenProps = ref<TokenProps>({
  applicationIdentification: "",
  applicationSecrectKey: ""
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  console.log("令牌更新", params);
  fetchAppToken();
};

// 更新 Token
const handleSubmit = async () => {
  try {
    if (drawerProps.value && drawerProps.value.row.ApplicationName) {
      const response = await getTokenUpdate(drawerProps.value.row.ApplicationName);
      if (!response || !response.applicationIdentification || !response.applicationSecrectKey) {
        console.error("⚠️ 令牌更新返回数据异常:", response);
        return;
      }
      const data = {
        applicationIdentification: response.applicationIdentification,
        applicationSecrectKey: response.applicationSecrectKey
      };
      tokenProps.value = data; // 更新 Token 数据
    } else {
      console.error("drawerProps.value.row 未定义");
    }
  } catch (error) {
    console.error("获取应用 Token 失败:", error);
  }
};
// 获取 Token
const fetchAppToken = async () => {
  try {
    // 确保 drawerProps.value.row 是一个对象，并且 ApplicationName 存在
    const appName = drawerProps.value?.row?.ApplicationName;
    if (!appName) {
      return;
    }

    // 调用 API 获取 Token
    const response = await getApplicationToken(appName);

    if (!response || !response.appId || !response.appKey) {
      console.error("⚠️ API 返回数据异常:", response);
      return;
    }

    // 组织转换后的数据
    const transformedRow = {
      applicationIdentification: response.appId,
      applicationSecrectKey: response.appKey
    };

    // 更新 Token 数据
    tokenProps.value = transformedRow;
    console.log("✅ 获取到的应用 Token:", transformedRow);
  } catch (error) {
    console.error("❌ 获取应用 Token 失败:", error);
  }
};

onMounted(fetchAppToken());

defineExpose({
  acceptParams
});
</script>
