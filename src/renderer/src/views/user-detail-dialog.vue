<template>
  <el-dialog v-model="isDialogVisible" title="用户信息">
    <el-descriptions>
      <el-descriptions-item label="用户名">{{ userAndPhotos?.username }}</el-descriptions-item>
      <el-descriptions-item label="真实姓名">{{ userAndPhotos?.realName }}</el-descriptions-item>
    </el-descriptions>
    <div v-if="showPhoto">
      <div v-for="photo in userAndPhotos?.photoList" :key="photo.id">
        <el-image style="width: 200px" :src="photo.path" fit="contain" />
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { UserAndPhotosVO } from '@shared/vo/user.vo'
import { computed, ref } from 'vue'

const isDialogVisible = ref(false)
const userAndPhotos = ref<UserAndPhotosVO | null>(null)
const showPhoto = computed(() => {
  return !!userAndPhotos.value?.photoList?.length
})
const showDialog = (userId: number) => {
  isDialogVisible.value = true
  window.api.getUserAndPhotos(userId).then((res) => {
    if (res.success) {
      userAndPhotos.value = res.data
    }
  })
}
defineExpose({
  showDialog
})
</script>
