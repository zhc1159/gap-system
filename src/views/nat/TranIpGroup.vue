<!-- IP Group Management - IP组管理 -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Grid /></el-icon>
        {{ t('nat.ipGroup.title') }}
      </h2>
      <p class="page-description">{{ t('nat.ipGroup.description') }}</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('common.add') }}
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
        <!-- Group Name -->
        <el-table-column prop="name" :label="t('nat.ipGroup.groupName')" width="200">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- IP Address -->
        <el-table-column prop="ip_range" :label="t('nat.ipGroup.ipAddress')" min-width="500">
          <template #default="{ row }">
            <el-tooltip :content="row.ip_range" placement="top" :disabled="row.ip_range.length <= 50">
              <span class="ip-text">{{ truncateText(row.ip_range, 50) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="t('common.actions')" fixed="right" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row.name)">
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
      width="700px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- Group Name -->
        <el-form-item :label="t('nat.ipGroup.groupName')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="t('nat.ipGroup.groupNamePlaceholder')"
            :disabled="dialogMode === 'edit'"
            maxlength="31"
            clearable
          />
        </el-form-item>

        <!-- IP Tags Area -->
        <el-form-item :label="t('nat.ipGroup.ipGroup')" prop="ip_range" class="ip-tag-area">
          <div class="tag-container">
            <transition-group name="tag-fade">
              <el-tag
                v-for="tag in ipTags"
                :key="tag"
                closable
                type="info"
                class="ip-tag"
                @close="handleRemoveTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </transition-group>
          </div>

          <div class="input-area">
            <el-input
              v-model="newIpAddress"
              :placeholder="t('nat.ipGroup.ipPlaceholder')"
              @keyup.enter="handleAddTag"
              clearable
              class="ip-input"
            />
            <el-button type="primary" @click="handleAddTag" class="add-btn">
              {{ t('nat.ipGroup.add') }}
            </el-button>
          </div>

          <div class="help-text">
            {{ t('nat.ipGroup.ipHelp') }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Grid, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface IpGroup {
  id?: number
  name: string
  ip_range: string
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<IpGroup[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const ipTags = ref<string[]>([])
const newIpAddress = ref('')

// Form Data
const formData = ref<IpGroup>({
  name: '',
  ip_range: ''
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.ipGroup.addGroup')
    : t('nat.ipGroup.editGroup')
})

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('nat.ipGroup.groupNameRequired'), trigger: 'blur' },
    { max: 31, message: t('nat.ipGroup.groupNameMaxLength'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('nat.ipGroup.groupNamePattern'), trigger: 'blur' }
  ],
  ip_range: [
    {
      validator: (rule, value, callback) => {
        if (ipTags.value.length === 0) {
          callback(new Error(t('nat.ipGroup.ipRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}))

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'web_servers', ip_range: '192.168.1.10,192.168.1.11,192.168.1.12' },
      { id: 2, name: 'db_servers', ip_range: '10.0.0.0/24' },
      { id: 3, name: 'trusted_hosts', ip_range: '172.16.0.1-172.16.0.100' }
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '......'
}

const validateIpFormat = (ip: string): boolean => {
  const patterns = {
    ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
    ipv6: /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/,
    cidr: /^(\d{1,3}\.){3}\d{1,3}\/\d{1,3}$/,
    range: /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/,
    domain: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
  }
  return Object.values(patterns).some(pattern => pattern.test(ip))
}

const handleAddTag = () => {
  const ip = newIpAddress.value.trim()

  if (!ip) {
    ElMessage.warning(t('nat.ipGroup.ipEmpty'))
    return
  }

  if (ipTags.value.includes(ip)) {
    ElMessage.warning(t('nat.ipGroup.ipDuplicate'))
    return
  }

  if (!validateIpFormat(ip)) {
    ElMessage.error(t('nat.ipGroup.ipInvalid'))
    return
  }

  ipTags.value.push(ip)
  newIpAddress.value = ''
}

const handleRemoveTag = (tag: string) => {
  const index = ipTags.value.indexOf(tag)
  if (index > -1) {
    ipTags.value.splice(index, 1)
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { name: '', ip_range: '' }
  ipTags.value = []
  dialogVisible.value = true
}

const handleEdit = (row: IpGroup) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  ipTags.value = row.ip_range.split(',').filter(Boolean)
  dialogVisible.value = true
}

const handleDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(t('nat.ipGroup.deleteConfirm', { name }), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    formData.value.ip_range = ipTags.value.join(',')
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(dialogMode.value === 'add' ? t('common.addSuccess') : t('common.editSuccess'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {} finally {
    submitting.value = false
  }
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
.page-container { padding: $spacing-lg; }

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
  .page-description { color: $text-secondary; font-size: $font-size-base; }
}

.action-bar { display: flex; justify-content: flex-end; margin-bottom: $spacing-md; }

.table-container { background: $bg-card; border: 1px solid $border-color; border-radius: $radius-lg; overflow: hidden; }

.tech-table :deep(.el-table__row) {
  transition: all 0.3s ease;
  &:hover { background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important; }
}

.rule-name { font-weight: 600; color: $primary-color; }
.ip-text { color: $text-primary; word-break: break-all; }

.pagination-wrapper { margin-top: $spacing-lg; display: flex; justify-content: flex-end; }

.ip-tag-area {
  .tag-container {
    min-height: 60px;
    max-height: 200px;
    overflow-y: auto;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: rgba($bg-dark, 0.6);
    margin-bottom: $spacing-sm;
  }

  .ip-tag {
    margin: 4px;
    background: rgba($primary-color, 0.1);
    border: 1px solid rgba($primary-color, 0.3);
    color: $primary-color;
  }

  .tag-fade-enter-active, .tag-fade-leave-active { transition: all 0.3s ease; }
  .tag-fade-enter-from, .tag-fade-leave-to { opacity: 0; transform: scale(0.8); }

  .input-area {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-xs;
    .ip-input { flex: 1; }
    .add-btn { flex-shrink: 0; }
  }

  .help-text {
    font-size: $font-size-xs;
    color: $text-muted;
    line-height: 1.5;
  }
}
</style>
