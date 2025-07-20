<template>
  <el-button @click="onAddUser" size="small" type="primary">新增用户</el-button>
  <el-table border :data="userList" style="width: 640px">
    <el-table-column fixed prop="id" label="ID" width="120" />
    <el-table-column fixed prop="username" label="用户名" width="150" />
    <el-table-column prop="realName" label="真实姓名" width="150" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-popconfirm
          @confirm="onDeleteUser(row)"
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="确认删除?"
        >
          <template #reference>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-popconfirm>
        <el-button link type="primary" size="small" @click="onDetail(row)">详情</el-button>
        <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        <el-button link type="primary" size="small" @click="onAddPhoto(row)">添加照片</el-button>
      </template>
    </el-table-column>
  </el-table>
  <UserEditDialog ref="userEditDialogRef" @save="onSaveSuccess" />
  <UserDetailDialog ref="userDetailDialogRef" />
</template>

<script lang="ts" setup>
import { UserVO } from '@shared/vo/user.vo'
import { PhotoCreateDTO } from '@shared/dto/photo.dto'
import { onMounted, ref, useTemplateRef } from 'vue'
import UserEditDialog from './user-edit-dialog.vue'
import UserDetailDialog from './user-detail-dialog.vue'
const userList = ref<UserVO[]>([])

const getUserList = () => {
  window.api.getUserList().then((res) => {
    if (res.success) {
      userList.value = res.data
      console.log('获取用户列表成功', userList.value)
    }
  })
}
onMounted(() => {
  getUserList()
})
const userDetailDialogRef =
  useTemplateRef<InstanceType<typeof UserDetailDialog>>('userDetailDialogRef')
const onDetail = (row: UserVO) => {
  userDetailDialogRef.value?.showDialog(row.id)
}

const userEditDialogRef = useTemplateRef<InstanceType<typeof UserEditDialog>>('userEditDialogRef')
const onEdit = (row: UserVO) => {
  userEditDialogRef.value?.showDialog(row.id)
}
const onAddUser = () => {
  userEditDialogRef.value?.showDialog()
}
const onSaveSuccess = () => {
  getUserList()
}
const onDeleteUser = (row: UserVO) => {
  window.api.deleteUser(row.id).then(() => {
    getUserList()
  })
}
const onAddPhoto = (row: UserVO) => {
  window.api.selectImage().then((res) => {
    const photoCreateForm: PhotoCreateDTO = {
      userId: row.id,
      source: res.originPath,
      filename: res.filename,
      path: res.filePath
    }
    window.api.createPhoto(photoCreateForm).then(() => {
      console.log('添加照片成功')
    })
  })
}
</script>
