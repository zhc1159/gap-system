<!-- ClientManage.vue - Client Management -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Monitor /></el-icon>
        {{ t('menu.login.clientManage') || 'Client Management' }}
      </h2>
      <p class="page-description">{{ t('login.clientManage.description') || 'Manage client connections' }}</p>
    </div>

    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('common.add') }}
      </el-button>
    </div>

    <el-card class="tech-card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" :label="t('common.name') || 'Name'" min-width="120" />
        <el-table-column prop="ip" :label="t('common.ip') || 'IP Address'" min-width="120" />
        <el-table-column prop="status" :label="t('common.status') || 'Status'" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" :label="t('common.lastLogin') || 'Last Login'" min-width="150" />
        <el-table-column :label="t('common.actions') || 'Actions'" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('common.name')" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="t('common.ip')" prop="ip">
          <el-input v-model="formData.ip" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Monitor, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const dialogTitle = computed(() => dialogMode.value === 'add' ? t('common.add') : t('common.edit'))

const formData = ref({ id: '', name: '', ip: '' })

const formRules: FormRules = {
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  ip: [{ required: true, message: t('common.required'), trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', name: 'Client-1', ip: '192.168.1.100', status: 'online', lastLogin: '2024-01-15 10:30:00' },
      { id: '2', name: 'Client-2', ip: '192.168.1.101', status: 'offline', lastLogin: '2024-01-14 15:20:00' }
    ]
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { id: '', name: '', ip: '' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (_row: any) => {
  try {
    await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {
  } finally {
    submitting.value = false
  }
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.page-container { padding: 20px; }
.page-header { margin-bottom: 20px; .page-title { display: flex; align-items: center; gap: 10px; font-size: 24px; color: #409eff; } .page-description { color: #909399; } }
.action-bar { margin-bottom: 16px; display: flex; justify-content: flex-end; }
.tech-card { background: #242836; border: 1px solid #2a2f3d; }
</style>
