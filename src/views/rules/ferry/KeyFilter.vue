<!-- ===========================================
     KeyFilter.vue - Ferry Keyword Filter Configuration
     =========================================== -->

<template>
  <div class="page-container key-filter">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="keyword-flow"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Key /></el-icon>
        <h2 class="title">{{ t('keyFilter.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('keyFilter.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="configList" stripe class="tech-table">
        <el-table-column prop="username" :label="t('keyFilter.username')" min-width="120" />
        <el-table-column prop="filterMode" :label="t('keyFilter.filterMode')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.filterMode === 'ACCEPT' ? 'success' : 'danger'">
              {{ row.filterMode === 'ACCEPT' ? t('keyFilter.accept') : t('keyFilter.reject') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('keyFilter.keywords')" min-width="300">
          <template #default="{ row }">
            <div class="keyword-list">
              <el-tag
                v-for="keyword in row.keywords.slice(0, 5)"
                :key="keyword"
                size="small"
                class="keyword-tag"
              >
                {{ keyword }}
              </el-tag>
              <el-tag v-if="row.keywords.length > 5" size="small" type="info">
                +{{ row.keywords.length - 5 }}
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
            <el-popconfirm :title="t('keyFilter.deleteConfirm')" @confirm="handleDelete(row.id)">
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
      :title="isEdit ? t('keyFilter.editTitle') : t('keyFilter.addTitle')"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('keyFilter.username')" prop="username">
          <el-input v-model="formData.username" :placeholder="t('keyFilter.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('keyFilter.filterMode')" prop="filterMode">
          <el-radio-group v-model="formData.filterMode">
            <el-radio value="ACCEPT">{{ t('keyFilter.accept') }}</el-radio>
            <el-radio value="REJECT">{{ t('keyFilter.reject') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('keyFilter.keywords')" prop="keywords">
          <div class="keyword-input-wrapper">
            <div class="keyword-tags">
              <el-tag
                v-for="keyword in formData.keywords"
                :key="keyword"
                closable
                @close="removeKeyword(keyword)"
                class="keyword-tag"
              >
                {{ keyword }}
              </el-tag>
            </div>
            <div class="keyword-add">
              <el-input
                v-model="newKeyword"
                :placeholder="t('keyFilter.keywordPlaceholder')"
                @keyup.enter="addKeyword"
              />
              <el-button type="primary" @click="addKeyword">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </div>
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
import { Key, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type FilterMode = 'ACCEPT' | 'REJECT'

interface KeyFilterConfig {
  id: string
  username: string
  filterMode: FilterMode
  keywords: string[]
  createTime: string
}

interface KeyFilterFormData {
  id?: string
  username: string
  filterMode: FilterMode
  keywords: string[]
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const newKeyword = ref('')

const configList = ref<KeyFilterConfig[]>([
  { id: '1', username: 'user1', filterMode: 'REJECT', keywords: ['password', 'secret', 'confidential'], createTime: '2024-01-10' },
  { id: '2', username: 'user2', filterMode: 'ACCEPT', keywords: ['report', 'document', 'data'], createTime: '2024-01-12' }
])

const formData = reactive<KeyFilterFormData>({
  id: undefined,
  username: '',
  filterMode: 'REJECT',
  keywords: []
})

const validateKeywords = (_rule: any, value: string[], callback: any) => {
  if (!value || value.length === 0) {
    callback(new Error(t('keyFilter.keywordsRequired')))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  username: [{ required: true, message: t('keyFilter.usernameRequired'), trigger: 'blur' }],
  keywords: [{ required: true, validator: validateKeywords, trigger: 'change' }]
}

// Methods
const addKeyword = () => {
  const keyword = newKeyword.value.trim()
  if (keyword && !formData.keywords.includes(keyword)) {
    formData.keywords.push(keyword)
    newKeyword.value = ''
  }
}

const removeKeyword = (keyword: string) => {
  const index = formData.keywords.indexOf(keyword)
  if (index > -1) {
    formData.keywords.splice(index, 1)
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { id: undefined, username: '', filterMode: 'REJECT', keywords: [] })
  newKeyword.value = ''
  dialogVisible.value = true
}

const handleEdit = (row: KeyFilterConfig) => {
  isEdit.value = true
  Object.assign(formData, { ...row, keywords: [...row.keywords] })
  newKeyword.value = ''
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
        config.keywords = [...formData.keywords]
      }
      ElMessage.success(t('common.success'))
    } else {
      const newConfig: KeyFilterConfig = {
        id: Date.now().toString(),
        username: formData.username,
        filterMode: formData.filterMode,
        keywords: [...formData.keywords],
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
.key-filter {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .keyword-flow {
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 30% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 70% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 40%);
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
    .keyword-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .keyword-tag {
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

  .keyword-input-wrapper {
    .keyword-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
      min-height: 32px;

      .keyword-tag {
        background: rgba(0, 212, 255, 0.1);
        border-color: rgba(0, 212, 255, 0.3);
        color: $primary-color;
      }
    }

    .keyword-add {
      display: flex;
      gap: 8px;
    }
  }
}

.w-full {
  width: 100%;
}
</style>
