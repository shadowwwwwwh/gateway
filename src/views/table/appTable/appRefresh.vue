<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" size="450px" title="准入令牌">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="应用名" prop="applicationsName">
        <el-input v-model="drawerProps.row.applicationName" placeholder="请填写应用名" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务域" prop="businessDomain">
        <el-input v-model="drawerProps.row.businessDomain" placeholder="请填写业务域" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务部门" prop="businessUnit">
        <el-input v-model="drawerProps.row.businessUnit" placeholder="请填写业务部门" clearable></el-input>
      </el-form-item>
      <el-form-item label="责任人" prop="manager">
        <el-input v-model="drawerProps.row.manager" placeholder="请填写责任人" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AppRefresh">
import { ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { App } from "@/api/interface";

interface DrawerProps {
  isView: boolean;
  row: Partial<App.ReqApplicationUpdate>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  row: {}
});
interface Params {
  isView: boolean;
  row: Partial<App.ReqApplication>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
// 接收父组件传过来的参数
const acceptParams = (params: Params) => {
  console.log("📢 接收到的参数 params:", params);

  // 进行字段转换
  const transformedRow: App.ReqApplicationUpdate = {
    applicationName_old: params.row.ApplicationName || "", // 旧值
    applicationName: "", // 用户新输入的
    businessDomain: "",
    businessUnit: "",
    manager: ""
  };

  // 赋值转换后的数据
  drawerProps.value = {
    ...params,
    row: transformedRow
  };

  drawerVisible.value = true;

  console.log("📢 更新后的 drawerProps.value:", drawerProps.value);
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
