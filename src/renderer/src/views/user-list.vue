<template>
  <el-button @click="onAdd">新增</el-button>
  <el-table border :data="userList" style="width: 580px;">
    <el-table-column fixed prop="id" label="ID" width="120" />
    <el-table-column fixed prop="username" label="用户名" width="150" />
    <el-table-column prop="realName" label="真实姓名" width="150" />
    <el-table-column label="操作">
      <template #default="{row}">
        <el-popconfirm @confirm="onDelete(row)" confirm-button-text="确认" cancel-button-text="取消" title="确认删除?">
          <template #reference>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-popconfirm>
        <el-button link type="primary" size="small" @click="onDetail"> 详情 </el-button>
        <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <UserEditDialog ref="userEditDialogRef" @save="onSaveSuccess" />
</template>

<script lang="ts" setup>
import { UserVO } from '@shared/types/user'
import { onMounted, ref } from 'vue'
import UserEditDialog from './user-edit-dialog.vue'
const userList = ref<UserVO[]>([])

const getUserList = () => {
  window.api.getUserList().then(res => {
    userList.value = res
  })
}
onMounted(() => {
  getUserList()
})
const onDetail = () => {
  window.api.getUserList().then(res=>{
    console.log(res)
  })
}

const userEditDialogRef = ref<InstanceType<typeof UserEditDialog>>()
const onEdit = (row: UserVO) => {
  userEditDialogRef.value?.showDialog(row.id)
}
const onAdd = () => {
  userEditDialogRef.value?.showDialog()
}
const onSaveSuccess = () => {
  getUserList()
}
const onDelete = (row: UserVO) => {
  window.api.deleteUser(row.id).then(() => {
    getUserList()
  })
}
</script>
