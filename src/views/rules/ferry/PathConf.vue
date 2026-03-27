<!-- PathConf.vue - Path Configuration -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><FolderOpened /></el-icon>
        {{ t('menu.rules.pathConf') || 'Path Configuration' }}
      </h2>
      <p class="page-description">{{ t('rules.pathConf.description') || 'Configure file transfer paths' }}</p>
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
        <el-table-column prop="sourcePath" :label="t('rules.sourcePath') || 'Source Path'" min-width="150" />
        <el-table-column prop="targetPath" :label="t('rules.targetPath') || 'Target Path'" min-width="150" />
        <el-table-column prop="permission" :label="t('rules.permission') || 'Permission'" width="120">
          <template #default="{ row }">
            <el-tag :type="row.permission === 'READ_WRITE' ? 'success' : 'info'" size="small">
              {{ row.permission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" :label="t('common.status') || 'Status'" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" />
          </template>
        </el-table-column>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('common.name')" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="t('rules.sourcePath')" prop="sourcePath">
          <el-input v-model="formData.sourcePath" />
        </el-form-item>
        <el-form-item :label="t('rules.targetPath')" prop="targetPath">
          <el-input v-model="formData.targetPath" />
        </el-form-item>
        <el-form-item :label="t('rules.permission')" prop="permission">
          <el-select v-model="formData.permission" style="width: 100%;">
            <el-option label="Read Only" value="READ" />
            <el-option label="Read & Write" value="READ_WRITE" />
          </el-select>
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
import { FolderOpened, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

type Permission = 'READ' | 'READ_WRITE'

interface PathConfig {
  id: string
  name: string
  sourcePath: string
  targetPath: string
  permission: Permission
  enabled: boolean
}

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<PathConfig[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const dialogTitle = computed(() => dialogMode.value === 'add' ? t('common.add') : t('common.edit'))

const formData = ref({
  id: '',
  name: '',
  sourcePath: '',
  targetPath: '',
  permission: 'READ' as Permission
})

const formRules: FormRules = {
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  sourcePath: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  targetPath: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  permission: [{ required: true, message: t('common.required'), trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', name: 'Data-Transfer', sourcePath: '/data/source', targetPath: '/data/target', permission: 'READ_WRITE', enabled: true },
      { id: '2', name: 'Log-Transfer', sourcePath: '/var/log', targetPath: '/backup/log', permission: 'READ', enabled: true }
    ]
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { id: '', name: '', sourcePath: '', targetPath: '', permission: 'READ' }
  dialogVisible.value = true
}

const handleEdit = (row: PathConfig) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (_row: PathConfig) => {
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
