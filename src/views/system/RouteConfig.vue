<!-- ===========================================
     RouteConfig.vue - Route Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('system.route.title')"
      titleEn="Route Config"
      :icon="Connection"
    >
      <template #extra>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('common.add') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Route Table -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #interface="{ row }">
        <el-tag type="info" size="small">{{ row.interface }}</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </el-button>
        <el-button type="danger" text size="small" @click="handleDelete(row)">
          {{ t('common.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px" :rules="formRules" ref="formRef">
        <el-form-item :label="t('system.route.destination')" prop="destination">
          <el-input v-model="form.destination" placeholder="192.168.0.0/24" />
        </el-form-item>
        <el-form-item :label="t('system.route.gateway')" prop="gateway">
          <el-input v-model="form.gateway" placeholder="192.168.1.254" />
        </el-form-item>
        <el-form-item :label="t('system.route.interface')" prop="interface">
          <el-select v-model="form.interface" placeholder="选择接口" style="width: 100%">
            <el-option label="eth0" value="eth0" />
            <el-option label="eth1" value="eth1" />
            <el-option label="eth2" value="eth2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('system.route.metric')" prop="metric">
          <el-input-number v-model="form.metric" :min="1" :max="9999" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Dialog
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  destination: '',
  gateway: '',
  interface: '',
  metric: 100
})

const dialogTitle = computed(() => isEdit.value ? t('common.edit') : t('common.add'))

// Form rules
const formRules: FormRules = {
  destination: [{ required: true, message: '请输入目标网络', trigger: 'blur' }],
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }],
  interface: [{ required: true, message: '请选择接口', trigger: 'change' }]
}

// Table columns
const columns: TableColumn[] = [
  { prop: 'destination', label: '目标网络', minWidth: 180 },
  { prop: 'gateway', label: '网关', minWidth: 150 },
  { prop: 'interface', label: '接口', width: 100 },
  { prop: 'metric', label: '跃点数', width: 100 }
]

// Mock data
function generateMockData(): any[] {
  return [
    { id: 1, destination: '0.0.0.0/0', gateway: '192.168.1.254', interface: 'eth0', metric: 100 },
    { id: 2, destination: '192.168.1.0/24', gateway: '0.0.0.0', interface: 'eth0', metric: 100 },
    { id: 3, destination: '10.0.0.0/8', gateway: '10.0.0.254', interface: 'eth1', metric: 50 },
    { id: 4, destination: '172.16.0.0/16', gateway: '172.16.0.254', interface: 'eth1', metric: 50 }
  ]
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateMockData()
    total.value = tableData.value.length
    loading.value = false
  }, 400)
}

// Reset form
function resetForm() {
  Object.assign(form, { id: 0, destination: '', gateway: '', interface: '', metric: 100 })
}

// Handle add
function handleAdd() {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

// Handle edit
function handleEdit(row: any) {
  Object.assign(form, row)
  isEdit.value = true
  dialogVisible.value = true
}

// Handle delete
async function handleDelete(row: any) {
  await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
  tableData.value = tableData.value.filter(item => item.id !== row.id)
  total.value = tableData.value.length
  ElMessage.success(t('common.deleteSuccess'))
}

// Handle submit
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    if (isEdit.value) {
      const index = tableData.value.findIndex(item => item.id === form.id)
      if (index > -1) tableData.value[index] = { ...form }
    } else {
      tableData.value.push({ ...form, id: Date.now() })
    }
    ElMessage.success(t('common.saveSuccess'))
    dialogVisible.value = false
  } catch { }
}

// Handle page change
function handlePageChange(page: number, limit: number) {
  pagination.page = page
  pagination.limit = limit
}

// Lifecycle
onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
