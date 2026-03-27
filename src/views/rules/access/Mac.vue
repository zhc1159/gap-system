<!-- ===========================================
     Mac.vue - MAC Address Management
     =========================================== -->

<template>
  <div class="page-container mac-management">
    <!-- Tech Background Decoration -->
    <div class="tech-bg-decoration">
      <div class="tech-line"></div>
      <div class="tech-line"></div>
      <div class="tech-dot"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Monitor /></el-icon>
        <h2 class="title">{{ t('mac.title') }}</h2>
      </div>
    </div>

    <!-- Search Bar -->
    <el-card class="search-card" shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('mac.searchPlaceholder')"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          {{ t('common.search') }}
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          {{ t('common.reset') }}
        </el-button>
        <el-button type="success" @click="handleAdd" class="add-btn">
          <el-icon><Plus /></el-icon>
          {{ t('mac.add') }}
        </el-button>
      </div>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="macList" stripe class="tech-table">
        <el-table-column type="index" :label="t('mac.index')" width="80" align="center" />
        <el-table-column prop="macAddr" :label="t('mac.macAddress')" min-width="200">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" class="mac-tag">
              {{ row.macAddr }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('mac.createTime')" width="180" />
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('mac.deleteConfirm')" @confirm="handleDelete(row.macAddr)">
              <template #reference>
                <el-button type="danger" size="small" link>
                  <el-icon><Delete /></el-icon>
                  {{ t('common.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('mac.editTitle') : t('mac.addTitle')"
      width="500px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('mac.macAddress')" prop="macAddr">
          <el-input v-model="formData.macAddr" :placeholder="t('mac.macPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Monitor, Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
interface MacAddress {
  id: string
  macAddr: string
  createTime: string
}

interface MacFormData {
  id?: string
  macAddr: string
}

// State
const loading = ref(false)
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

const macList = ref<MacAddress[]>([
  { id: '1', macAddr: '00:1A:2B:3C:4D:5E', createTime: '2024-01-15 10:00:00' },
  { id: '2', macAddr: 'AA:BB:CC:DD:EE:FF', createTime: '2024-01-16 11:30:00' },
  { id: '3', macAddr: '11:22:33:44:55:66', createTime: '2024-01-17 09:15:00' }
])

const formData = reactive<MacFormData>({
  id: undefined,
  macAddr: ''
})

// MAC address validation
const macValidator = (_rule: any, value: string, callback: any) => {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  if (!value) {
    callback(new Error(t('mac.macRequired')))
  } else if (!macRegex.test(value)) {
    callback(new Error(t('mac.macFormatError')))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  macAddr: [{ required: true, validator: macValidator, trigger: 'blur' }]
}

// Methods
const handleSearch = () => {
  if (searchKeyword.value) {
    // Filter logic would go here
    ElMessage.success(t('common.success'))
  }
}

const handleReset = () => {
  searchKeyword.value = ''
  currentPage.value = 1
}

const handleAdd = () => {
  isEdit.value = false
  formData.id = undefined
  formData.macAddr = ''
  dialogVisible.value = true
}

const handleEdit = (row: MacAddress) => {
  isEdit.value = true
  formData.id = row.id
  formData.macAddr = row.macAddr
  dialogVisible.value = true
}

const handleDelete = async (macAddr: string) => {
  const index = macList.value.findIndex(item => item.macAddr === macAddr)
  if (index > -1) {
    macList.value.splice(index, 1)
    total.value--
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const mac = macList.value.find(item => item.id === formData.id)
      if (mac) {
        mac.macAddr = formData.macAddr
      }
      ElMessage.success(t('common.success'))
    } else {
      const newMac: MacAddress = {
        id: Date.now().toString(),
        macAddr: formData.macAddr,
        createTime: new Date().toLocaleString()
      }
      macList.value.push(newMac)
      total.value++
      ElMessage.success(t('common.success'))
    }
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  // Fetch initial data
})
</script>

<style scoped lang="scss">
.mac-management {
  .tech-bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;

    .tech-line {
      position: absolute;
      width: 2px;
      height: 200px;
      background: linear-gradient(180deg, transparent, $primary-color, transparent);
      animation: flow 3s ease-in-out infinite;

      &:nth-child(1) {
        left: 10%;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        right: 15%;
        animation-delay: 1.5s;
      }
    }

    .tech-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background: $primary-color;
      border-radius: 50%;
      top: 20%;
      right: 20%;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  @keyframes flow {
    0%, 100% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.5); opacity: 1; }
  }

  .page-header {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    .title-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 28px;
        color: $primary-color;
        filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5));
      }

      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .search-card,
  .table-card {
    background: $bg-card;
    border: 1px solid $border-color;
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
  }

  .search-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .search-input {
      width: 300px;
    }

    .add-btn {
      margin-left: auto;
    }
  }

  .tech-table {
    .mac-tag {
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }

    :deep(th) {
      background: rgba(0, 212, 255, 0.1) !important;
      color: $primary-color !important;
    }

    :deep(td) {
      background: transparent;
      color: $text-primary;
    }

    :deep(.el-table__row:hover td) {
      background: rgba(0, 212, 255, 0.1) !important;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.w-full {
  width: 100%;
}
</style>
