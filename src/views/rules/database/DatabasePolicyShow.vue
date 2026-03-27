<!-- DatabasePolicyShow.vue - Database Policy Configuration -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Coin /></el-icon>
        {{ t('menu.rules.databasePolicy') || 'Database Policy' }}
      </h2>
      <p class="page-description">{{ t('rules.databasePolicy.description') || 'Configure database sync policies' }}</p>
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
        <el-table-column prop="sourceDb" :label="t('rules.sourceDb') || 'Source DB'" min-width="120" />
        <el-table-column prop="targetDb" :label="t('rules.targetDb') || 'Target DB'" min-width="120" />
        <el-table-column prop="syncMode" :label="t('rules.syncMode') || 'Sync Mode'" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.syncMode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('common.status') || 'Status'" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="(val: string | number | boolean) => handleToggleStatus(row.id, !!val)" />
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
        <el-form-item :label="t('rules.sourceDb')" prop="sourceDb">
          <el-input v-model="formData.sourceDb" />
        </el-form-item>
        <el-form-item :label="t('rules.targetDb')" prop="targetDb">
          <el-input v-model="formData.targetDb" />
        </el-form-item>
        <el-form-item :label="t('rules.syncMode')" prop="syncMode">
          <el-select v-model="formData.syncMode" style="width: 100%;">
            <el-option label="Full Sync" value="full" />
            <el-option label="Incremental" value="incremental" />
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
import { Coin, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const dialogTitle = computed(() => dialogMode.value === 'add' ? t('common.add') : t('common.edit'))

const formData = ref({
  id: '',
  name: '',
  sourceDb: '',
  targetDb: '',
  syncMode: 'full',
  enabled: true
})

const formRules: FormRules = {
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  sourceDb: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  targetDb: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  syncMode: [{ required: true, message: t('common.required'), trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', name: 'Policy-1', sourceDb: 'MySQL-Master', targetDb: 'MySQL-Slave', syncMode: 'full', enabled: true },
      { id: '2', name: 'Policy-2', sourceDb: 'Oracle-Primary', targetDb: 'Oracle-Standby', syncMode: 'incremental', enabled: false }
    ]
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { id: '', name: '', sourceDb: '', targetDb: '', syncMode: 'full', enabled: true }
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

const handleToggleStatus = (_id: string, _val: boolean) => {
  ElMessage.success(t('common.success'))
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
