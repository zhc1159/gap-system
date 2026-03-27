<!-- ===========================================
     LandingZone.vue - Ferry Landing Zone Configuration
     =========================================== -->

<template>
  <div class="page-container landing-zone">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="storage-scan"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Folder /></el-icon>
        <h2 class="title">{{ t('landingZone.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('landingZone.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="zoneList" stripe class="tech-table">
        <el-table-column prop="name" :label="t('landingZone.zoneName')" min-width="150">
          <template #default="{ row }">
            <div class="zone-name">
              <el-icon class="zone-icon"><Folder /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('landingZone.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? t('landingZone.active') : t('landingZone.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('landingZone.path')" min-width="200" />
        <el-table-column :label="t('landingZone.storage')" min-width="200">
          <template #default="{ row }">
            <div class="storage-info">
              <el-progress
                :percentage="getStoragePercentage(row)"
                :color="getStorageColor(row)"
                :stroke-width="10"
              />
              <span class="storage-text">
                {{ formatSize(row.usedStorage) }} / {{ formatSize(row.maxStorage) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('landingZone.deleteConfirm')" @confirm="handleDelete(row.id)">
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
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('landingZone.editTitle') : t('landingZone.addTitle')"
      width="550px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('landingZone.zoneName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('landingZone.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('landingZone.path')" prop="path">
          <el-input v-model="formData.path" :placeholder="t('landingZone.pathPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('landingZone.maxStorage')" prop="maxStorage">
          <el-input-number v-model="formData.maxStorage" :min="100" :max="102400" :step="100" />
          <span class="unit">MB</span>
        </el-form-item>
        <el-form-item :label="t('landingZone.status')" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="ACTIVE">{{ t('landingZone.active') }}</el-radio>
            <el-radio value="INACTIVE">{{ t('landingZone.inactive') }}</el-radio>
          </el-radio-group>
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
import { Folder, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type ZoneStatus = 'ACTIVE' | 'INACTIVE'

interface LandingZone {
  id: string
  name: string
  path: string
  status: ZoneStatus
  maxStorage: number
  usedStorage: number
  createTime: string
}

interface LandingZoneFormData {
  id?: string
  name: string
  path: string
  status: ZoneStatus
  maxStorage: number
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const zoneList = ref<LandingZone[]>([
  { id: '1', name: 'Primary-LZ', path: '/data/landing/primary', status: 'ACTIVE', maxStorage: 10240, usedStorage: 5120, createTime: '2024-01-10 09:00:00' },
  { id: '2', name: 'Backup-LZ', path: '/data/landing/backup', status: 'INACTIVE', maxStorage: 51200, usedStorage: 8192, createTime: '2024-01-12 14:30:00' }
])

const formData = reactive<LandingZoneFormData>({
  id: undefined,
  name: '',
  path: '',
  status: 'ACTIVE',
  maxStorage: 10240
})

const formRules: FormRules = {
  name: [{ required: true, message: t('landingZone.nameRequired'), trigger: 'blur' }],
  path: [{ required: true, message: t('landingZone.pathRequired'), trigger: 'blur' }],
  maxStorage: [{ required: true, message: t('landingZone.storageRequired'), trigger: 'blur' }]
}

// Methods
const getStoragePercentage = (row: LandingZone) => {
  if (!row.maxStorage) return 0
  return Math.round((row.usedStorage || 0) / row.maxStorage * 100)
}

const getStorageColor = (row: LandingZone) => {
  const percentage = getStoragePercentage(row)
  if (percentage >= 90) return '#f56c6c'
  if (percentage >= 70) return '#e6a23c'
  return '#00d4ff'
}

const formatSize = (mb: number) => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { id: undefined, name: '', path: '', status: 'ACTIVE', maxStorage: 10240 })
  dialogVisible.value = true
}

const handleEdit = (row: LandingZone) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = zoneList.value.findIndex(item => item.id === id)
  if (index > -1) {
    zoneList.value.splice(index, 1)
    ElMessage.success(t('common.deleteSuccess'))
  }
}

    const handleSubmit = async () => {
      const valid = await formRef.value?.validate()
      if (!valid) return

      submitLoading.value = true
      try {
        if (isEdit.value && formData.id) {
          const zone = zoneList.value.find(item => item.id === formData.id)
          if (zone) {
            zone.name = formData.name
            zone.path = formData.path
            zone.status = formData.status
            zone.maxStorage = formData.maxStorage
          }
          ElMessage.success(t('common.success'))
        } else {
          const newZone: LandingZone = {
            id: Date.now().toString(),
            name: formData.name,
            path: formData.path,
            status: formData.status,
            maxStorage: formData.maxStorage,
            usedStorage: 0,
            createTime: new Date().toLocaleString()
          }
          zoneList.value.push(newZone)
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
.landing-zone {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .storage-scan {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255,0.02) 0%, transparent 60%);
    }
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
      }

      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .action-card,
  .table-card {
    background: $bg-card;
    border: 1px solid $border-color;
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
  }

  .tech-table {
    .zone-name {
      display: flex;
      align-items: center;
      gap: 8px;

      .zone-icon {
        color: $primary-color;
      }
    }

    .storage-info {
      .storage-text {
        display: block;
        margin-top: 8px;
        font-size: 12px;
        color: $text-primary;
      }
    }

    :deep(th) {
      background: rgba(0, 212, 255, 0.1) !important;
      color: $primary-color !important;
    }

    :deep(td) {
      background: transparent;
      color: $text-primary;
    }
  }
}

.w-full {
  width: 100%;
}

.tech-dialog {
  .unit {
    margin-left: 8px;
    color: $text-primary;
  }
}
</style>
