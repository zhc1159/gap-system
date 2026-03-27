<!-- ===========================================
     Rules.vue - Agent Rules Configuration
     =========================================== -->

<template>
  <div class="page-container rules-config">
    <!-- Tech Background Decoration -->
    <div class="tech-bg-decoration">
      <div class="tech-grid"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Setting /></el-icon>
        <h2 class="title">{{ t('rules.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('rules.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="rulesList" stripe class="tech-table">
        <el-table-column prop="name" :label="t('rules.ruleName')" min-width="150" />
        <el-table-column prop="status" :label="t('rules.status')" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              @change="(val: string | number | boolean) => handleToggleStatus(row.id, !!val)"
              active-color="#00d4ff"
              inactive-color="#4a5568"
            />
          </template>
        </el-table-column>
        <el-table-column prop="protocol" :label="t('rules.protocol')" width="100">
          <template #default="{ row }">
            <el-tag :type="getProtocolTagType(row.protocol)">
              {{ row.protocol }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="direction" :label="t('rules.direction')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.direction === 'IN' ? 'success' : 'warning'" size="small">
              {{ row.direction === 'IN' ? t('rules.inbound') : t('rules.outbound') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('rules.createTime')" width="180" />
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm
              :title="t('rules.deleteConfirm')"
              @confirm="handleDelete(row.id)"
            >
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
      :title="isEdit ? t('rules.editTitle') : t('rules.addTitle')"
      width="500px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('rules.ruleName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('rules.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('rules.protocol')" prop="protocol">
          <el-select v-model="formData.protocol" class="w-full">
            <el-option label="TCP" value="TCP" />
            <el-option label="UDP" value="UDP" />
            <el-option label="ICMP" value="ICMP" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('rules.direction')" prop="direction">
          <el-radio-group v-model="formData.direction">
            <el-radio value="IN">{{ t('rules.inbound') }}</el-radio>
            <el-radio value="OUT">{{ t('rules.outbound') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('rules.status')" prop="status">
          <el-switch v-model="formData.status" />
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
import { Setting, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type Protocol = 'TCP' | 'UDP' | 'ICMP'
type Direction = 'IN' | 'OUT'

interface Rule {
  id: string
  name: string
  status: boolean
  protocol: Protocol
  direction: Direction
  createTime: string
}

interface RuleFormData {
  id?: string
  name: string
  status: boolean
  protocol: Protocol
  direction: Direction
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const rulesList = ref<Rule[]>([
  { id: '1', name: 'HTTP-Inbound', status: true, protocol: 'TCP', direction: 'IN', createTime: '2024-01-15 10:30:00' },
  { id: '2', name: 'DNS-Outbound', status: true, protocol: 'UDP', direction: 'OUT', createTime: '2024-01-15 11:00:00' },
  { id: '3', name: 'ICMP-Allow', status: false, protocol: 'ICMP', direction: 'IN', createTime: '2024-01-16 09:00:00' }
])

const formData = reactive<RuleFormData>({
  id: undefined,
  name: '',
  status: true,
  protocol: 'TCP',
  direction: 'IN'
})

const formRules: FormRules = {
  name: [{ required: true, message: t('rules.nameRequired'), trigger: 'blur' }],
  protocol: [{ required: true, message: t('rules.protocolRequired'), trigger: 'change' }],
  direction: [{ required: true, message: t('rules.directionRequired'), trigger: 'change' }]
}

// Methods
const getProtocolTagType = (protocol: Protocol): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const types: Record<Protocol, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    TCP: 'primary',
    UDP: 'success',
    ICMP: 'warning'
  }
  return types[protocol]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: undefined,
    name: '',
    status: true,
    protocol: 'TCP',
    direction: 'IN'
  })
  dialogVisible.value = true
}

const handleEdit = (row: Rule) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    status: row.status,
    protocol: row.protocol,
    direction: row.direction
  })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = rulesList.value.findIndex(item => item.id === id)
  if (index > -1) {
    rulesList.value.splice(index, 1)
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleToggleStatus = async (id: string, status: boolean) => {
  const rule = rulesList.value.find(item => item.id === id)
  if (rule) {
    rule.status = status
    ElMessage.success(t('common.success'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const rule = rulesList.value.find(item => item.id === formData.id)
      if (rule) {
        rule.name = formData.name
        rule.status = formData.status
        rule.protocol = formData.protocol
        rule.direction = formData.direction
      }
      ElMessage.success(t('common.success'))
    } else {
      const newRule: Rule = {
        id: Date.now().toString(),
        name: formData.name,
        status: formData.status,
        protocol: formData.protocol,
        direction: formData.direction,
        createTime: new Date().toLocaleString()
      }
      rulesList.value.push(newRule)
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
.rules-config {
  .tech-bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .tech-grid {
      width: 100%;
      height: 100%;
      background-image:
        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }
  }

  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
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
