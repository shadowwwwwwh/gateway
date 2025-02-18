<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" size="450px" title="属性更新">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="应用名" prop="applicationsName">
        <el-input v-model="drawerProps.row.userName" placeholder="请填写应用名" clearable :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="业务域" prop="businessDomain">
        <el-input v-model="drawerProps.row.userAttribute" placeholder="请填写用户属性" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务部门" prop="businessUnit">
        <el-input v-model="drawerProps.row.userOccupation" placeholder="请填写用户归口" clearable :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AttributeRefresh">
import { ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { App } from "@/api/interface";

interface DrawerProps {
  isView: boolean;
  row: Partial<App.ReqAttribute>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `属性更新成功！` });
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
