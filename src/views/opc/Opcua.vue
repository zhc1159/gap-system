<!-- ===========================================
     Opcua.vue - OPCUA Protocol Security Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('opcua.title')"
      titleEn="OPCUA Protocol Security Configuration"
      :icon="Setting"
    />

    <!-- Warning Alert -->
    <el-alert
      v-if="gapModel !== '0'"
      :title="t('opcua.warning')"
      type="warning"
      show-icon
      :closable="false"
      class="warning-alert"
    />

    <!-- Content based on mode -->
    <template v-if="gapModel === '0'">
      <!-- Toolbar -->
      <div class="toolbar">
        <el-input
          v-model="searchText"
          :placeholder="t('common.search')"
          prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('opcua.table.add') }}
        </el-button>
      </div>

      <!-- Data Table -->
      <CommonTable
        :data="filteredData"
        :columns="columns"
        :loading="loading"
        :show-pagination="true"
        :total="total"
        :page="currentPage"
        :limit="pageSize"
        @page-change="handlePageChange"
      >
        <template #actions="{ row }">
          <el-button type="warning" link size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            {{ t('opcua.table.edit') }}
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            {{ t('opcua.table.delete') }}
          </el-button>
        </template>
      </CommonTable>
    </template>

    <template v-else>
      <el-empty :description="t('opcua.warning')" class="empty-state" />
    </template>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('opcua.dialog.editTitle') : t('opcua.dialog.addTitle')"
      width="550px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('opcua.form.switch')" prop="rule_work">
          <el-switch
            v-model="formData.rule_work"
            :active-value="1"
            :inactive-value="0"
            active-color="#10b981"
            inactive-color="#ef4444"
          />
        </el-form-item>

        <el-form-item :label="t('opcua.form.userGroup')" prop="groupName">
          <el-select
            v-model="formData.groupName"
            :placeholder="t('opcua.form.selectUserGroup')"
            :disabled="isEdit"
            style="width: 100%"
          >
            <el-option
              v-for="group in userGroups"
              :key="group.value"
              :label="group.label"
              :value="group.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('opcua.form.signalBlacklist')" prop="black_cmd">
          <el-select
            v-model="formData.black_cmd"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('opcua.form.selectSignal')"
            style="width: 100%"
          >
            <el-option
              v-for="cmd in opcuaCommands"
              :key="cmd.value"
              :label="cmd.label"
              :value="cmd.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Setting, Plus, Edit, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'

const { t } = useI18n()

// Types
interface OpcuaRule {
  id?: string
  groupName: string
  rule_work: 0 | 1
  black_cmd: string[]
}

// State
const loading = ref(false)
const submitting = ref(false)
const searchText = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formRef = ref<FormInstance>()
const gapModel = ref('0') // '0' = routing mode

// Mock Data
const tableData = ref<OpcuaRule[]>([
  {
    id: '1',
    groupName: 'opc_group1',
    rule_work: 1,
    black_cmd: ['FindServers', 'GetEndpoints']
  },
  {
    id: '2',
    groupName: 'opc_group2',
    rule_work: 0,
    black_cmd: ['CreateSession']
  }
])

const userGroups = ref([
  { label: 'opc_group1', value: 'opc_group1' },
  { label: 'opc_group2', value: 'opc_group2' },
  { label: 'opc_group3', value: 'opc_group3' }
])

const opcuaCommands = ref([
  { label: 'FindServers', value: 'FindServers' },
  { label: 'GetEndpoints', value: 'GetEndpoints' },
  { label: 'CreateSession', value: 'CreateSession' },
  { label: 'ActivateSession', value: 'ActivateSession' },
  { label: 'CloseSession', value: 'CloseSession' },
  { label: 'Read', value: 'Read' },
  { label: 'Write', value: 'Write' },
  { label: 'Browse', value: 'Browse' },
  { label: 'Subscribe', value: 'Subscribe' },
  { label: 'CreateSubscription', value: 'CreateSubscription' },
  { label: 'DeleteSubscription', value: 'DeleteSubscription' },
  { label: 'Call', value: 'Call' }
])

// Form Data
const formData = reactive<OpcuaRule>({
  groupName: '',
  rule_work: 1,
  black_cmd: []
})

// Table Columns
const columns = computed(() => [
  { prop: 'groupName', label: t('opcua.table.userGroup'), minWidth: 150 },
  {
    prop: 'rule_work',
    label: t('opcua.table.status'),
    width: 100,
    type: 'status' as const,
    statusMap: {
      '1': { label: t('common.enabled'), type: 'success' as const },
      '0': { label: t('common.disabled'), type: 'danger' as const }
    }
  },
  { prop: 'black_cmd', label: t('opcua.table.signalBlacklist'), minWidth: 300 }
])

// Form Rules
const formRules: FormRules = {
  groupName: [{ required: true, message: t('opcua.form.selectUserGroup'), trigger: 'change' }]
}

// Computed
const filteredData = computed(() => {
  if (!searchText.value) return tableData.value
  const search = searchText.value.toLowerCase()
  return tableData.value.filter(item =>
    item.groupName.toLowerCase().includes(search)
  )
})

// Methods
const handlePageChange = (page: number, limit: number) => {
  currentPage.value = page
  pageSize.value = limit
}

const resetForm = () => {
  formData.groupName = ''
  formData.rule_work = 1
  formData.black_cmd = []
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: OpcuaRule) => {
  isEdit.value = true
  Object.assign(formData, { ...row, black_cmd: [...row.black_cmd] })
  dialogVisible.value = true
}

const handleDelete = async (row: OpcuaRule) => {
  try {
    await ElMessageBox.confirm(t('opcua.message.deleteConfirm'), t('common.confirm'), {
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success(t('opcua.message.deleteSuccess'))
    }
  } catch {
    // Cancelled
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        const index = tableData.value.findIndex(item => item.id === formData.id)
        if (index > -1) {
          tableData.value[index] = { ...formData }
        }
        ElMessage.success(t('opcua.message.editSuccess'))
      } else {
        tableData.value.push({
          ...formData,
          id: Date.now().toString()
        })
        ElMessage.success(t('opcua.message.addSuccess'))
      }
      dialogVisible.value = false
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  total.value = tableData.value.length
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.page-container {
  padding: $spacing-lg;
}

.warning-alert {
  margin-bottom: $spacing-lg;
}

.toolbar {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .search-input {
    width: 300px;
  }
}

.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
  }

  :deep(.el-dialog__header) {
    border-bottom: 1px solid $border-color;
    padding: $spacing-md $spacing-lg;
  }

  :deep(.el-dialog__body) {
    padding: $spacing-lg;
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
