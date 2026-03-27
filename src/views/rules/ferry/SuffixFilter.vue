<!-- ===========================================
     SuffixFilter.vue - Ferry Suffix Filter Configuration
     =========================================== -->

<template>
  <div class="page-container suffix-filter">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="file-flow"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Document /></el-icon>
        <h2 class="title">{{ t('suffixFilter.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('suffixFilter.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="configList" stripe class="tech-table">
        <el-table-column prop="username" :label="t('suffixFilter.username')" min-width="120" />
        <el-table-column prop="filterMode" :label="t('suffixFilter.filterMode')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.filterMode === 'WHITELIST' ? 'success' : 'danger'">
              {{ row.filterMode === 'WHITELIST' ? t('suffixFilter.whitelist') : t('suffixFilter.blacklist') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('suffixFilter.fileSuffix')" min-width="250">
          <template #default="{ row }">
            <div class="suffix-list">
              <el-tag
                v-for="suffix in row.suffixes.slice(0, 6)"
                :key="suffix"
                size="small"
                class="suffix-tag"
              >
                {{ suffix }}
              </el-tag>
              <el-tag v-if="row.suffixes.length > 6" size="small" type="info">
                +{{ row.suffixes.length - 6 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('suffixFilter.deleteConfirm')" @confirm="handleDelete(row.id)">
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
      :title="isEdit ? t('suffixFilter.editTitle') : t('suffixFilter.addTitle')"
      width="550px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('suffixFilter.username')" prop="username">
          <el-input v-model="formData.username" :placeholder="t('suffixFilter.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('suffixFilter.filterMode')" prop="filterMode">
          <el-radio-group v-model="formData.filterMode">
            <el-radio value="WHITELIST">{{ t('suffixFilter.whitelist') }}</el-radio>
            <el-radio value="BLACKLIST">{{ t('suffixFilter.blacklist') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('suffixFilter.fileSuffix')" prop="suffixes">
          <el-select
            v-model="formData.suffixes"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            :placeholder="t('suffixFilter.suffixPlaceholder')"
            class="w-full"
          >
            <el-option
              v-for="suffix in commonSuffixes"
              :key="suffix"
              :label="suffix"
              :value="suffix"
            />
          </el-select>
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
import { Document, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type FilterMode = 'WHITELIST' | 'BLACKLIST'

interface SuffixFilterConfig {
  id: string
  username: string
  filterMode: FilterMode
  suffixes: string[]
  createTime: string
}

interface SuffixFilterFormData {
  id?: string
  username: string
  filterMode: FilterMode
  suffixes: string[]
}

// Common file suffixes
const commonSuffixes = [
  '.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg',
  '.zip', '.rar', '.7z', '.tar', '.gz',
  '.exe', '.bat', '.cmd', '.msi',
  '.mp3', '.mp4', '.avi', '.mov', '.wmv',
  '.html', '.css', '.js', '.json', '.xml',
  '.dll', '.so', '.apk', '.ipa'
]

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const configList = ref<SuffixFilterConfig[]>([
  { id: '1', username: 'user1', filterMode: 'BLACKLIST', suffixes: ['.exe', '.bat', '.cmd', '.dll'], createTime: '2024-01-10' },
  { id: '2', username: 'user2', filterMode: 'WHITELIST', suffixes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'], createTime: '2024-01-12' }
])

const formData = reactive<SuffixFilterFormData>({
  id: undefined,
  username: '',
  filterMode: 'BLACKLIST',
  suffixes: []
})

const formRules: FormRules = {
  username: [{ required: true, message: t('suffixFilter.usernameRequired'), trigger: 'blur' }],
  suffixes: [{ required: true, message: t('suffixFilter.suffixesRequired'), trigger: 'change' }]
}

// Methods
const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { id: undefined, username: '', filterMode: 'BLACKLIST', suffixes: [] })
  dialogVisible.value = true
}

const handleEdit = (row: SuffixFilterConfig) => {
  isEdit.value = true
  Object.assign(formData, { ...row, suffixes: [...row.suffixes] })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = configList.value.findIndex(item => item.id === id)
  if (index > -1) {
    configList.value.splice(index, 1)
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const config = configList.value.find(item => item.id === formData.id)
      if (config) {
        config.username = formData.username
        config.filterMode = formData.filterMode
        config.suffixes = [...formData.suffixes]
      }
      ElMessage.success(t('common.success'))
    } else {
      const newConfig: SuffixFilterConfig = {
        id: Date.now().toString(),
        username: formData.username,
        filterMode: formData.filterMode,
        suffixes: [...formData.suffixes],
        createTime: new Date().toLocaleDateString()
      }
      configList.value.push(newConfig)
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
.suffix-filter {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .file-flow {
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.04) 0%, transparent 40%);
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
    .suffix-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .suffix-tag {
        font-family: 'Courier New', monospace;
        background: rgba(0, 212, 255, 0.1);
        border-color: rgba(0, 212, 255, 0.3);
        color: $primary-color;
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
</style>
