<template>
  <el-dialog style="width: 80%; max-width: 400px" v-model="isDialogVisible" :title="dialogTitle">
    <el-form ref="userFormRef" :model="userForm" :rules="formRules" label-width="auto">
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
import { UserUpdateDTO } from '@shared/dto/user.dto'
import { FormInstance } from 'element-plus'
import { computed, ref, toRaw } from 'vue'
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
}
const isDialogVisible = ref(false)
type UserForm = {
  id?: number
  username: string
  realName: string
}
const userForm = ref<UserForm>({
  username: '',
  realName: ''
})
const isAdd = ref(true)
const dialogTitle = computed(() => {
  return isAdd.value ? '新增用户' : '编辑用户信息'
})
const emits = defineEmits<{
  (e: 'save'): void
}>()

const showDialog = (id?: number) => {
  if (id) {
    isAdd.value = false
    window.api.getUserInfo(id).then((res) => {
      if (res.success) {
        userForm.value = res.data
        isDialogVisible.value = true
      }
    })
  } else {
    isAdd.value = true
    userForm.value = {
      username: '',
      realName: ''
    }
    isDialogVisible.value = true
  }
}

const onCancel = () => {
  isDialogVisible.value = false
}

const userFormRef = ref<FormInstance>()
const onSave = async () => {
  const valid = await userFormRef.value?.validate()
  if (!valid) {
    return
  }
  if (isAdd.value) {
    window.api.addUser(toRaw(userForm.value)).then(() => {
      isDialogVisible.value = false
      emits('save')
    })
  } else {
    window.api.saveUser(toRaw(userForm.value as UserUpdateDTO)).then(() => {
      isDialogVisible.value = false
      emits('save')
    })
  }
}

defineExpose({ showDialog })
</script>
