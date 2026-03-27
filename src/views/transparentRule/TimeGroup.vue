<!-- Time Group Management - Time Management -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Clock /></el-icon>
        {{ t('transparentRule.timeGroup.title') }}
      </h2>
      <p class="page-description">{{ t('transparentRule.timeGroup.description') }}</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('transparentRule.timeGroup.addGroup') }}
      </el-button>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        class="tech-table"
      >
        <el-table-column prop="name" :label="t('transparentRule.timeGroup.groupName')" min-width="150">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('transparentRule.timeGroup.startDate')" width="120" align="center">
          <template #default="{ row }">
            <div class="date-cell">
              <el-icon><Calendar /></el-icon>
              <span>{{ row.startDate }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('transparentRule.timeGroup.endDate')" width="120" align="center">
          <template #default="{ row }">
            <div class="date-cell">
              <el-icon><Calendar /></el-icon>
              <span>{{ row.endDate }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('transparentRule.timeGroup.startTime')" width="100" align="center">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ row.startTime }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('transparentRule.timeGroup.endTime')" width="100" align="center">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ row.endTime }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('transparentRule.timeGroup.weekdays')" min-width="180">
          <template #default="{ row }">
            <div class="weekday-tags">
              <el-tag
                v-for="day in parseWeekdays(row.weekdays)"
                :key="day"
                size="small"
                type="info"
                class="weekday-tag"
              >
                {{ day }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('common.actions')" fixed="right" width="150">
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
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- Form Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('transparentRule.timeGroup.groupName')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="t('transparentRule.timeGroup.groupNamePlaceholder')"
            maxlength="31"
            show-word-limit
            @input="handleNameInput"
          />
        </el-form-item>

        <el-form-item :label="t('transparentRule.timeGroup.dateRange')" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            :range-separator="t('transparentRule.timeGroup.to')"
            :start-placeholder="t('transparentRule.timeGroup.startDate')"
            :end-placeholder="t('transparentRule.timeGroup.endDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="t('transparentRule.timeGroup.timeRange')" prop="timeRange">
          <el-time-picker
            v-model="formData.timeRange"
            is-range
            :range-separator="t('transparentRule.timeGroup.to')"
            :start-placeholder="t('transparentRule.timeGroup.startTime')"
            :end-placeholder="t('transparentRule.timeGroup.endTime')"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="t('transparentRule.timeGroup.weekdaySelection')">
          <div class="weekday-checkboxes">
            <el-checkbox
              v-for="option in weekdayOptions"
              :key="option.value"
              :label="option.value"
              v-model="selectedWeekdays"
            >
              {{ locale === 'zh-CN' ? option.label : option.labelEn }}
            </el-checkbox>
          </div>
          <div class="weekday-hint">
            {{ t('transparentRule.timeGroup.weekdayHint') }}
          </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, Plus, Edit, Delete, Calendar } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t, locale } = useI18n()

// Interfaces
interface TimeGroup {
  id: number
  name: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  weekdays: number
}

interface TimeGroupFormData {
  id?: number
  name: string
  dateRange: [string, string]
  timeRange: [string, string]
}

interface WeekdayOption {
  value: number
  label: string
  labelEn: string
}

// Weekday enum values
const Weekday = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 4,
  THURSDAY: 8,
  FRIDAY: 16,
  SATURDAY: 32,
  SUNDAY: 64
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<TimeGroup[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingGroup = ref<TimeGroup | null>(null)
const formRef = ref<FormInstance>()
const selectedWeekdays = ref<number[]>([])

// Form Data
const formData = reactive<TimeGroupFormData>({
  id: undefined,
  name: '',
  dateRange: ['', ''],
  timeRange: ['', '']
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('transparentRule.timeGroup.addGroup')
    : t('transparentRule.timeGroup.editGroup')
})

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('transparentRule.timeGroup.groupNameRequired'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('transparentRule.timeGroup.groupNamePattern'), trigger: 'blur' },
    { max: 31, message: t('transparentRule.timeGroup.groupNameMax'), trigger: 'blur' }
  ],
  dateRange: [
    { required: true, message: t('transparentRule.timeGroup.dateRangeRequired'), trigger: 'change' }
  ],
  timeRange: [
    { required: true, message: t('transparentRule.timeGroup.timeRangeRequired'), trigger: 'change' }
  ]
}))

// Weekday Options
const weekdayOptions: WeekdayOption[] = [
  { value: Weekday.MONDAY, label: 'Monday', labelEn: 'Mon' },
  { value: Weekday.TUESDAY, label: 'Tuesday', labelEn: 'Tue' },
  { value: Weekday.WEDNESDAY, label: 'Wednesday', labelEn: 'Wed' },
  { value: Weekday.THURSDAY, label: 'Thursday', labelEn: 'Thu' },
  { value: Weekday.FRIDAY, label: 'Friday', labelEn: 'Fri' },
  { value: Weekday.SATURDAY, label: 'Saturday', labelEn: 'Sat' },
  { value: Weekday.SUNDAY, label: 'Sunday', labelEn: 'Sun' }
]

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'workday', startDate: '2024-01-01', endDate: '2024-12-31', startTime: '09:00', endTime: '18:00', weekdays: 31 },
      { id: 2, name: 'weekend', startDate: '2024-01-01', endDate: '2024-12-31', startTime: '00:00', endTime: '23:59', weekdays: 96 },
      { id: 3, name: 'all_day', startDate: '2024-01-01', endDate: '2024-12-31', startTime: '00:00', endTime: '23:59', weekdays: 127 }
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  editingGroup.value = null
  selectedWeekdays.value = []
  formData.id = undefined
  formData.name = ''
  formData.dateRange = ['', '']
  formData.timeRange = ['', '']
  dialogVisible.value = true
}

const handleEdit = (row: TimeGroup) => {
  dialogMode.value = 'edit'
  editingGroup.value = row
  formData.id = row.id
  formData.name = row.name
  formData.dateRange = [row.startDate, row.endDate]
  formData.timeRange = [row.startTime, row.endTime]
  selectedWeekdays.value = parseWeekdayMask(row.weekdays)
  dialogVisible.value = true
}

const handleDelete = async (row: TimeGroup) => {
  try {
    await ElMessageBox.confirm(
      t('transparentRule.timeGroup.deleteConfirm', { name: row.name }),
      t('common.confirm'),
      { type: 'warning' }
    )
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch {
    // cancelled
  }
}

const handleNameInput = (value: string) => {
  formData.name = value.replace(/[^a-zA-Z0-9_]/g, '')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))

    const weekdayMask = selectedWeekdays.value.reduce((acc, val) => acc + val, 0)

    const submitData = {
      name: formData.name,
      startDate: formData.dateRange[0],
      endDate: formData.dateRange[1],
      startTime: formData.timeRange[0],
      endTime: formData.timeRange[1],
      weekdays: weekdayMask === 0 ? 127 : weekdayMask
    }

    console.log('Submit data:', submitData)
    ElMessage.success(t('common.success'))
    dialogVisible.value = false
    fetchData()
  } catch {
    // validation failed
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.name = ''
  formData.dateRange = ['', '']
  formData.timeRange = ['', '']
  selectedWeekdays.value = []
}

const parseWeekdayMask = (mask: number): number[] => {
  const weekdays: number[] = []
  if (mask & Weekday.MONDAY) weekdays.push(Weekday.MONDAY)
  if (mask & Weekday.TUESDAY) weekdays.push(Weekday.TUESDAY)
  if (mask & Weekday.WEDNESDAY) weekdays.push(Weekday.WEDNESDAY)
  if (mask & Weekday.THURSDAY) weekdays.push(Weekday.THURSDAY)
  if (mask & Weekday.FRIDAY) weekdays.push(Weekday.FRIDAY)
  if (mask & Weekday.SATURDAY) weekdays.push(Weekday.SATURDAY)
  if (mask & Weekday.SUNDAY) weekdays.push(Weekday.SUNDAY)
  return weekdays
}

const parseWeekdays = (mask: number): string[] => {
  const days: string[] = []
  const dayNames = locale.value === 'zh-CN'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const weekdayValues = [1, 2, 4, 8, 16, 32, 64]

  weekdayValues.forEach((value, index) => {
    if (mask & value) {
      days.push(dayNames[index])
    }
  })

  // Optimize display
  if (days.length === 5 && days.includes(dayNames[0]) && days.includes(dayNames[4])) {
    return [locale.value === 'zh-CN' ? 'Mon-Fri' : 'Mon-Fri']
  }

  if (days.length === 2 && days.includes(dayNames[5]) && days.includes(dayNames[6])) {
    return [locale.value === 'zh-CN' ? 'Weekend' : 'Weekend']
  }

  if (days.length === 7) {
    return [locale.value === 'zh-CN' ? 'Everyday' : 'Everyday']
  }

  return days
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
}

.page-header {
  margin-bottom: $spacing-lg;

  .page-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-xs;

    .el-icon { color: $primary-color; }
  }

  .page-description {
    color: $text-secondary;
    font-size: $font-size-base;
  }
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: $spacing-md;
}

.table-container {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
}

.tech-table {
  :deep(.el-table__row) {
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important;
      transform: translateX(2px);
    }
  }
}

.name-text {
  font-weight: 600;
  color: $text-primary;
}

.date-cell,
.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .el-icon {
    color: $primary-color;
  }
}

.weekday-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .weekday-tag {
    margin: 0;
  }
}

.pagination-wrapper {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}

.weekday-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  :deep(.el-checkbox) {
    color: $text-primary;

    .el-checkbox__label {
      color: $text-primary;
    }

    &.is-checked {
      .el-checkbox__inner {
        background: $gradient-primary;
        border-color: $primary-color;
      }

      .el-checkbox__label {
        color: $primary-color;
      }
    }
  }
}

.weekday-hint {
  margin-top: 8px;
  font-size: 12px;
  color: $text-muted;
}
</style>
