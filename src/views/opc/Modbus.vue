<!-- ===========================================
     Modbus.vue - MODBUS Protocol Security Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('modbus.title')"
      titleEn="MODBUS Security Configuration"
      :icon="Setting"
    />

    <!-- Toolbar -->
    <div class="toolbar">
      <el-input
        v-model="searchText"
        :placeholder="t('common.search')"
        prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('modbus.table.add') }}
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
        <el-button type="primary" link size="small" @click="handleView(row)">
          <el-icon><View /></el-icon>
          {{ t('modbus.table.viewDetails') }}
        </el-button>
        <el-button type="warning" link size="small" @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          {{ t('modbus.table.edit') }}
        </el-button>
        <el-button type="danger" link size="small" @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          {{ t('modbus.table.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('modbus.dialog.editTitle') : t('modbus.dialog.addTitle')"
      width="700px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('modbus.form.switch')" prop="rule_work">
          <el-switch
            v-model="formData.rule_work"
            :active-value="1"
            :inactive-value="0"
            active-color="#10b981"
            inactive-color="#ef4444"
          />
        </el-form-item>

        <el-form-item :label="t('modbus.form.userGroup')" prop="groupName">
          <el-select
            v-model="formData.groupName"
            :placeholder="t('modbus.form.selectUserGroup')"
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

        <el-form-item :label="t('modbus.form.signalBlacklist')" prop="black_cmd">
          <el-select
            v-model="formData.black_cmd"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('modbus.form.selectSignal')"
            style="width: 100%"
          >
            <el-option
              v-for="cmd in signalOptions"
              :key="cmd.value"
              :label="cmd.label"
              :value="cmd.value"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('modbus.form.registerControl')">
              <el-button type="primary" @click="showRegisterDialog">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('modbus.form.coilControl')">
              <el-button type="primary" @click="showCoilDialog">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Control Rules Table -->
        <el-table :data="formData.reg_str" size="small" max-height="200" class="control-table">
          <el-table-column :label="t('modbus.form.type')" width="100">
            <template #default="{ row }">
              {{ row.type === 'rw_reg' ? t('modbus.types.register') : t('modbus.types.coil') }}
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="t('modbus.form.address')" width="100" />
          <el-table-column prop="begin" :label="t('modbus.form.startValue')" width="120" />
          <el-table-column prop="end" :label="t('modbus.form.endValue')" width="100" />
          <el-table-column label="" width="80">
            <template #default="{ $index }">
              <el-button type="danger" link size="small" @click="removeRule($index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Register Config Dialog -->
    <el-dialog
      v-model="registerDialogVisible"
      :title="t('modbus.form.registerControl')"
      width="400px"
      append-to-body
      class="tech-dialog"
    >
      <el-form :model="registerForm" label-width="100px">
        <el-form-item :label="t('modbus.form.address')">
          <el-input-number v-model="registerForm.address" :min="0" :max="255" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('modbus.form.startValue')">
          <el-input-number v-model="registerForm.begin" :min="0" :max="65535" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('modbus.form.endValue')">
          <el-input-number v-model="registerForm.end" :min="0" :max="65535" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="registerDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addRegister">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Coil Config Dialog -->
    <el-dialog
      v-model="coilDialogVisible"
      :title="t('modbus.form.coilControl')"
      width="400px"
      append-to-body
      class="tech-dialog"
    >
      <el-form :model="coilForm" label-width="100px">
        <el-form-item :label="t('modbus.form.address')">
          <el-input-number v-model="coilForm.address" :min="1" :max="255" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('modbus.form.status')">
          <el-radio-group v-model="coilForm.begin">
            <el-radio :value="255">{{ t('modbus.form.on') }}(255)</el-radio>
            <el-radio :value="0">{{ t('modbus.form.off') }}(0)</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="coilDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addCoil">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- View Details Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('modbus.table.viewDetails')"
      width="600px"
      class="tech-dialog"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('modbus.table.userGroup')">
          {{ currentRow?.groupName }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('modbus.table.status')">
          <el-tag :type="currentRow?.rule_work ? 'success' : 'danger'">
            {{ currentRow?.rule_work ? t('common.enabled') : t('common.disabled') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('modbus.form.signalBlacklist')" :span="2">
          <el-tag
            v-for="cmd in currentRow?.black_cmd"
            :key="cmd"
            type="info"
            class="signal-tag"
          >
            {{ cmd }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('modbus.form.registerControl')" :span="2">
          <el-table :data="currentRow?.reg_str?.filter((r: RegisterConfig) => r.type === 'rw_reg')" size="small">
            <el-table-column prop="address" :label="t('modbus.form.address')" />
            <el-table-column prop="begin" :label="t('modbus.form.startValue')" />
            <el-table-column prop="end" :label="t('modbus.form.endValue')" />
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item :label="t('modbus.form.coilControl')" :span="2">
          <el-table :data="currentRow?.reg_str?.filter((r: RegisterConfig) => r.type === 'rw_status')" size="small">
            <el-table-column prop="address" :label="t('modbus.form.address')" />
            <el-table-column prop="begin" :label="t('modbus.form.status')">
              <template #default="{ row }">
                {{ row.begin === 255 ? t('modbus.form.on') : t('modbus.form.off') }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Setting, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'

const { t } = useI18n()

// Types
interface RegisterConfig {
  type: 'rw_reg' | 'rw_status'
  address: number
  begin: number
  end?: number
}

interface ModbusRule {
  id?: string
  groupName: string
  rule_work: 0 | 1
  black_cmd: string[]
  reg_str: RegisterConfig[]
}

// State
const loading = ref(false)
const submitting = ref(false)
const searchText = ref('')
const dialogVisible = ref(false)
const registerDialogVisible = ref(false)
const coilDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formRef = ref<FormInstance>()
const currentRow = ref<ModbusRule | null>(null)

// Mock Data
const tableData = ref<ModbusRule[]>([
  {
    id: '1',
    groupName: 'group1',
    rule_work: 1,
    black_cmd: ['READ_HOLDING_REGISTERS', 'WRITE_SINGLE_REGISTER'],
    reg_str: [
      { type: 'rw_reg', address: 1, begin: 0, end: 100 },
      { type: 'rw_status', address: 2, begin: 255 }
    ]
  },
  {
    id: '2',
    groupName: 'group2',
    rule_work: 0,
    black_cmd: ['FORCE_SINGLE_COIL'],
    reg_str: []
  }
])

const userGroups = ref([
  { label: 'group1', value: 'group1' },
  { label: 'group2', value: 'group2' },
  { label: 'group3', value: 'group3' }
])

const signalOptions = ref([
  { label: 'Read Holding Registers (03)', value: 'READ_HOLDING_REGISTERS' },
  { label: 'Read Input Registers (04)', value: 'READ_INPUT_REGISTERS' },
  { label: 'Write Single Register (06)', value: 'WRITE_SINGLE_REGISTER' },
  { label: 'Write Multiple Registers (16)', value: 'WRITE_MULTIPLE_REGISTERS' },
  { label: 'Force Single Coil (05)', value: 'FORCE_SINGLE_COIL' },
  { label: 'Force Multiple Coils (15)', value: 'FORCE_MULTIPLE_COILS' }
])

// Form Data
const formData = reactive<ModbusRule>({
  groupName: '',
  rule_work: 1,
  black_cmd: [],
  reg_str: []
})

const registerForm = reactive({
  address: 0,
  begin: 0,
  end: 0
})

const coilForm = reactive({
  address: 1,
  begin: 255
})

// Table Columns
const columns = computed(() => [
  { prop: 'groupName', label: t('modbus.table.userGroup'), minWidth: 120 },
  {
    prop: 'rule_work',
    label: t('modbus.table.status'),
    width: 100,
    type: 'status' as const,
    statusMap: {
      '1': { label: t('common.enabled'), type: 'success' as const },
      '0': { label: t('common.disabled'), type: 'danger' as const }
    }
  },
  { prop: 'black_cmd', label: t('modbus.table.signalBlacklist'), minWidth: 250 }
])

// Form Rules
const formRules: FormRules = {
  groupName: [{ required: true, message: t('modbus.form.selectUserGroup'), trigger: 'change' }]
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
const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number, limit: number) => {
  currentPage.value = page
  pageSize.value = limit
}

const resetForm = () => {
  formData.groupName = ''
  formData.rule_work = 1
  formData.black_cmd = []
  formData.reg_str = []
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: ModbusRule) => {
  isEdit.value = true
  Object.assign(formData, { ...row, reg_str: [...row.reg_str] })
  dialogVisible.value = true
}

const handleView = (row: ModbusRule) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

const handleDelete = async (row: ModbusRule) => {
  try {
    await ElMessageBox.confirm(t('modbus.message.deleteConfirm'), t('common.confirm'), {
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success(t('modbus.message.deleteSuccess'))
    }
  } catch {
    // Cancelled
  }
}

const showRegisterDialog = () => {
  registerForm.address = 0
  registerForm.begin = 0
  registerForm.end = 0
  registerDialogVisible.value = true
}

const showCoilDialog = () => {
  coilForm.address = 1
  coilForm.begin = 255
  coilDialogVisible.value = true
}

const addRegister = () => {
  formData.reg_str.push({
    type: 'rw_reg',
    address: registerForm.address,
    begin: registerForm.begin,
    end: registerForm.end
  })
  registerDialogVisible.value = false
}

const addCoil = () => {
  formData.reg_str.push({
    type: 'rw_status',
    address: coilForm.address,
    begin: coilForm.begin
  })
  coilDialogVisible.value = false
}

const removeRule = (index: number) => {
  formData.reg_str.splice(index, 1)
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
        ElMessage.success(t('modbus.message.editSuccess'))
      } else {
        tableData.value.push({
          ...formData,
          id: Date.now().toString()
        })
        ElMessage.success(t('modbus.message.addSuccess'))
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

.toolbar {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .search-input {
    width: 300px;
  }
}

.control-table {
  margin-top: $spacing-md;
}

.signal-tag {
  margin-right: $spacing-xs;
  margin-bottom: $spacing-xs;
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
