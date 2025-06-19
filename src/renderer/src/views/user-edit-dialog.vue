<template>
  <el-dialog v-model="isDialogVisible" :title="dialogTitle">
      <el-form ref="userFormRef" :model="userForm" :rules="formRules" label-width="auto" style="max-width: 600px">
          <el-form-item label="用户名">
            <el-input :disabled="!!userForm.id" v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="userForm.realName" />
          </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { UserEditDTO } from '@shared/types/user';
import { FormInstance } from 'element-plus';
import { computed, ref, toRaw } from 'vue';
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ]
}
const isDialogVisible = ref(false);
const userForm = ref<UserEditDTO>({
  username: '',
  realName: ''
})
const dialogTitle = computed(() => {
  return userForm.value.id ? '编辑用户' : '新增用户';
})
const emits = defineEmits<{
  (e: 'save'): void;
}>()

const showDialog = (id?: number) => {
  if(id){
    window.api.getUserInfo(id).then(res => {
      userForm.value = res;
      isDialogVisible.value = true;
    })
  }else{
    userForm.value = {
      username: '',
      realName: ''
    };
    isDialogVisible.value = true;
  }
}

const onCancel = () => {
  isDialogVisible.value = false;
}

const userFormRef = ref<FormInstance>()
const onSave = async () => {
  const valid = await userFormRef.value?.validate();
  if (!valid) {
    return;
  }
  window.api.saveUser(toRaw(userForm.value)).then(() => {
    isDialogVisible.value = false;
    emits('save');
  })
}


defineExpose({
  showDialog
})
</script>