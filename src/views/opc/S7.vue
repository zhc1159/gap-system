<!-- ===========================================
     S7.vue - S7 Protocol Security Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('s7.title')"
      titleEn="S7 Security Configuration"
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
      />
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('s7.table.add') }}
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
          {{ t('s7.table.viewDetails') }}
        </el-button>
        <el-button type="warning" link size="small" @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          {{ t('s7.table.edit') }}
        </el-button>
        <el-button type="danger" link size="small" @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          {{ t('s7.table.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Edit Dialog with Steps -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('s7.dialog.editTitle') : t('s7.dialog.addTitle')"
      width="750px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <!-- Steps Navigation -->
      <el-steps :active="currentStep" finish-status="success" class="form-steps">
        <el-step :title="t('s7.steps.basic')" />
        <el-step :title="t('s7.steps.readControl')" />
        <el-step :title="t('s7.steps.writeControl')" />
      </el-steps>

      <div class="step-content">
        <!-- Step 1: Basic Config -->
        <div v-show="currentStep === 0" class="step-panel">
          <el-form :model="formData" label-width="180px">
            <el-form-item :label="t('s7.form.switch')">
              <el-switch
                v-model="formData.rule_work"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>

            <el-form-item :label="t('s7.form.userGroup')">
              <el-select
                v-model="formData.group_name"
                :disabled="isEdit"
                style="width: 100%"
              >
                <el-option
                  v-for="g in userGroups"
                  :key="g.value"
                  :label="g.label"
                  :value="g.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('s7.form.protocolExt')">
              <el-switch
                v-model="formData.userdata_disable"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>

            <el-form-item :label="t('s7.form.userdataBlacklist')">
              <el-select
                v-model="formData.userdata_func_filter"
                multiple
                filterable
                style="width: 100%"
              >
                <el-option value="BlocksInfo" :label="t('s7.userdata.blocksInfo')" />
                <el-option value="SZL" :label="t('s7.userdata.szl')" />
                <el-option value="Security" :label="t('s7.userdata.security')" />
                <el-option value="Clock" :label="t('s7.userdata.clock')" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('s7.form.jobBlacklist')">
              <el-select
                v-model="formData.job_func_filter"
                multiple
                filterable
                style="width: 100%"
              >
                <el-option v-for="job in jobOptions" :key="job" :label="job" :value="job" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('s7.form.ackBlacklist')">
              <el-select
                v-model="formData.ack_func_filter"
                multiple
                filterable
                style="width: 100%"
              >
                <el-option v-for="ack in ackOptions" :key="ack" :label="ack" :value="ack" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 2: Read Data Control -->
        <div v-show="currentStep === 1" class="step-panel">
          <el-form :model="formData" label-width="140px">
            <el-form-item :label="t('s7.dataConfig.readFilter')">
              <el-radio-group v-model="formData.r_filter_type">
                <el-radio :value="0">{{ t('s7.dataConfig.noLimit') }}</el-radio>
                <el-radio :value="1">{{ t('s7.dataConfig.whitelist') }}</el-radio>
                <el-radio :value="2">{{ t('s7.dataConfig.blacklist') }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <DataConfigTable v-model="formData.r_tabs" />
          </el-form>
        </div>

        <!-- Step 3: Write Data Control -->
        <div v-show="currentStep === 2" class="step-panel">
          <el-form :model="formData" label-width="140px">
            <el-form-item :label="t('s7.dataConfig.writeFilter')">
              <el-radio-group v-model="formData.w_filter_type">
                <el-radio :value="0">{{ t('s7.dataConfig.noLimit') }}</el-radio>
                <el-radio :value="1">{{ t('s7.dataConfig.whitelist') }}</el-radio>
                <el-radio :value="2">{{ t('s7.dataConfig.blacklist') }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <DataConfigTable v-model="formData.w_tabs" />
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button v-if="currentStep > 0" @click="prevStep">{{ t('common.prev') }}</el-button>
        <el-button v-if="currentStep < 2" type="primary" @click="nextStep">{{ t('common.next') }}</el-button>
        <el-button v-if="currentStep === 2" type="primary" :loading="submitting" @click="handleSubmit">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- View Details Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('s7.table.viewDetails')"
      width="700px"
      class="tech-dialog"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('s7.table.userGroup')">
          {{ currentRow?.group_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.table.status')">
          <el-tag :type="currentRow?.rule_work ? 'success' : 'danger'">
            {{ currentRow?.rule_work ? t('common.enabled') : t('common.disabled') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.table.protocolExt')">
          <el-tag :type="currentRow?.userdata_disable ? 'warning' : 'success'">
            {{ currentRow?.userdata_disable ? t('common.disabled') : t('common.enabled') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.form.jobBlacklist')">
          <el-tag v-for="job in currentRow?.job_func_filter" :key="job" type="info" class="signal-tag">
            {{ job }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.form.ackBlacklist')" :span="2">
          <el-tag v-for="ack in currentRow?.ack_func_filter" :key="ack" type="warning" class="signal-tag">
            {{ ack }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.dataConfig.readFilter')">
          {{ getFilterTypeLabel(currentRow?.r_filter_type) }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('s7.dataConfig.writeFilter')">
          {{ getFilterTypeLabel(currentRow?.w_filter_type) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'

const { t } = useI18n()

// Types
interface DataConfig {
  block: 'CT' | 'TM' | 'PE' | 'PA' | 'MK' | 'DB'
  dbIndex: number
  startAddr: string
  endAddr: string
}

interface S7Rule {
  id?: string
  rule_work: 0 | 1
  userdata_disable: 0 | 1
  group_name: string
  userdata_func_filter: string[]
  job_func_filter: string[]
  ack_func_filter: string[]
  r_filter_type: 0 | 1 | 2
  r_tabs: DataConfig[]
  w_filter_type: 0 | 1 | 2
  w_tabs: DataConfig[]
}

// Data Config Table Component
const DataConfigTable = defineComponent({
  name: 'DataConfigTable',
  props: {
    modelValue: { type: Array as () => DataConfig[], default: () => [] }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const addRow = () => {
      emit('update:modelValue', [
        ...props.modelValue,
        { block: 'DB', dbIndex: 0, startAddr: '', endAddr: '' }
      ])
    }

    const removeRow = (index: number) => {
      const newData = [...props.modelValue]
      newData.splice(index, 1)
      emit('update:modelValue', newData)
    }

    return () => h('div', { class: 'data-config-table' }, [
      h('div', { class: 'table-toolbar', style: 'margin-bottom: 12px' }, [
        h('button', {
          class: 'el-button el-button--primary el-button--small',
          onClick: addRow
        }, [
          h('span', { class: 'el-icon' }, [h(Plus)]),
          t('common.add')
        ])
      ]),
      h('table', { class: 'el-table config-inner-table' }, [
        h('thead', [
          h('tr', [
            h('th', { class: 'el-table__cell', style: 'width: 120px' }, t('s7.dataConfig.dataBlock')),
            h('th', { class: 'el-table__cell', style: 'width: 120px' }, t('s7.dataConfig.dbIndex')),
            h('th', { class: 'el-table__cell', style: 'width: 140px' }, t('s7.dataConfig.startAddr')),
            h('th', { class: 'el-table__cell', style: 'width: 140px' }, t('s7.dataConfig.endAddr')),
            h('th', { class: 'el-table__cell', style: 'width: 80px' }, '')
          ])
        ]),
        h('tbody', props.modelValue.map((row, index) =>
          h('tr', { key: index }, [
            h('td', { class: 'el-table__cell' }, [
              h('select', {
                class: 'el-select',
                value: row.block,
                onChange: (e: Event) => {
                  const newValue = [...props.modelValue]
                  newValue[index] = { ...row, block: (e.target as HTMLSelectElement).value as any }
                  emit('update:modelValue', newValue)
                },
                style: 'width: 100%'
              }, ['CT', 'TM', 'PE', 'PA', 'MK', 'DB'].map(b =>
                h('option', { value: b, key: b }, b)
              ))
            ]),
            h('td', { class: 'el-table__cell' }, [
              h('input', {
                class: 'el-input__inner',
                type: 'number',
                value: row.dbIndex,
                min: 0,
                onInput: (e: Event) => {
                  const newValue = [...props.modelValue]
                  newValue[index] = { ...row, dbIndex: parseInt((e.target as HTMLInputElement).value) || 0 }
                  emit('update:modelValue', newValue)
                },
                style: 'width: 100%'
              })
            ]),
            h('td', { class: 'el-table__cell' }, [
              h('input', {
                class: 'el-input__inner',
                type: 'text',
                value: row.startAddr,
                placeholder: t('s7.dataConfig.hexPlaceholder'),
                onInput: (e: Event) => {
                  const newValue = [...props.modelValue]
                  newValue[index] = { ...row, startAddr: (e.target as HTMLInputElement).value }
                  emit('update:modelValue', newValue)
                },
                style: 'width: 100%'
              })
            ]),
            h('td', { class: 'el-table__cell' }, [
              h('input', {
                class: 'el-input__inner',
                type: 'text',
                value: row.endAddr,
                placeholder: t('s7.dataConfig.hexPlaceholder'),
                onInput: (e: Event) => {
                  const newValue = [...props.modelValue]
                  newValue[index] = { ...row, endAddr: (e.target as HTMLInputElement).value }
                  emit('update:modelValue', newValue)
                },
                style: 'width: 100%'
              })
            ]),
            h('td', { class: 'el-table__cell' }, [
              h('button', {
                class: 'el-button el-button--danger el-button--small is-link',
                onClick: () => removeRow(index)
              }, [
                h('span', { class: 'el-icon' }, [h(Delete)])
              ])
            ])
          ])
        ))
      ])
    ])
  }
})

// State
const loading = ref(false)
const submitting = ref(false)
const searchText = ref('')
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const currentStep = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentRow = ref<S7Rule | null>(null)

// Mock Data
const tableData = ref<S7Rule[]>([
  {
    id: '1',
    rule_work: 1,
    userdata_disable: 0,
    group_name: 'plc_group1',
    userdata_func_filter: ['SZL'],
    job_func_filter: ['JOB_READ_VAR'],
    ack_func_filter: ['ACK_READ'],
    r_filter_type: 0,
    r_tabs: [],
    w_filter_type: 1,
    w_tabs: [{ block: 'DB', dbIndex: 1, startAddr: '0x0000', endAddr: '0x00FF' }]
  }
])

const userGroups = ref([
  { label: 'plc_group1', value: 'plc_group1' },
  { label: 'plc_group2', value: 'plc_group2' }
])

const jobOptions = ['JOB_READ_VAR', 'JOB_WRITE_VAR', 'JOB_START', 'JOB_STOP']
const ackOptions = ['ACK_READ', 'ACK_WRITE', 'ACK_START', 'ACK_STOP']

// Form Data
const formData = reactive<S7Rule>({
  rule_work: 1,
  userdata_disable: 0,
  group_name: '',
  userdata_func_filter: [],
  job_func_filter: [],
  ack_func_filter: [],
  r_filter_type: 0,
  r_tabs: [],
  w_filter_type: 0,
  w_tabs: []
})

// Table Columns
const columns = computed(() => [
  { prop: 'group_name', label: t('s7.table.userGroup'), minWidth: 120 },
  {
    prop: 'rule_work',
    label: t('s7.table.status'),
    width: 100,
    type: 'status' as const,
    statusMap: {
      '1': { label: t('common.enabled'), type: 'success' as const },
      '0': { label: t('common.disabled'), type: 'danger' as const }
    }
  },
  { prop: 'userdata_disable', label: t('s7.table.protocolExt'), width: 120 }
])

// Computed
const filteredData = computed(() => {
  if (!searchText.value) return tableData.value
  const search = searchText.value.toLowerCase()
  return tableData.value.filter(item =>
    item.group_name.toLowerCase().includes(search)
  )
})

// Methods
const handlePageChange = (page: number, limit: number) => {
  currentPage.value = page
  pageSize.value = limit
}

const resetForm = () => {
  formData.rule_work = 1
  formData.userdata_disable = 0
  formData.group_name = ''
  formData.userdata_func_filter = []
  formData.job_func_filter = []
  formData.ack_func_filter = []
  formData.r_filter_type = 0
  formData.r_tabs = []
  formData.w_filter_type = 0
  formData.w_tabs = []
  currentStep.value = 0
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: S7Rule) => {
  isEdit.value = true
  Object.assign(formData, {
    ...row,
    r_tabs: [...row.r_tabs],
    w_tabs: [...row.w_tabs],
    userdata_func_filter: [...row.userdata_func_filter],
    job_func_filter: [...row.job_func_filter],
    ack_func_filter: [...row.ack_func_filter]
  })
  currentStep.value = 0
  dialogVisible.value = true
}

const handleView = (row: S7Rule) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

const handleDelete = async (row: S7Rule) => {
  try {
    await ElMessageBox.confirm(t('s7.message.deleteConfirm'), t('common.confirm'), {
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success(t('s7.message.deleteSuccess'))
    }
  } catch {
    // Cancelled
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++
}

const getFilterTypeLabel = (type?: 0 | 1 | 2) => {
  switch (type) {
    case 1: return t('s7.dataConfig.whitelist')
    case 2: return t('s7.dataConfig.blacklist')
    default: return t('s7.dataConfig.noLimit')
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEdit.value) {
      const index = tableData.value.findIndex(item => item.id === formData.id)
      if (index > -1) {
        tableData.value[index] = { ...formData }
      }
      ElMessage.success(t('s7.message.editSuccess'))
    } else {
      tableData.value.push({
        ...formData,
        id: Date.now().toString()
      })
      ElMessage.success(t('s7.message.addSuccess'))
    }
    dialogVisible.value = false
  } finally {
    submitting.value = false
  }
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

.form-steps {
  margin-bottom: $spacing-xl;
}

.step-content {
  min-height: 400px;
}

.step-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
    max-height: 65vh;
    overflow-y: auto;
  }
}

.config-inner-table {
  width: 100%;
  border-collapse: collapse;

  .el-table__cell {
    padding: 8px 12px;
    border: 1px solid $border-color;
    background: $bg-secondary;
  }

  .el-input__inner,
  .el-select {
    padding: 4px 8px;
    border-radius: $radius-sm;
    border: 1px solid $border-color;
    background: $bg-primary;
    color: $text-primary;
  }
}
</style>
