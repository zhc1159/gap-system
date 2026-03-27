<!-- ===========================================
     VideoAgent.vue - Video Agent Configuration
     =========================================== -->

<template>
  <div class="page-container video-agent">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="wave-animation"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><VideoCamera /></el-icon>
        <h2 class="title">{{ t('videoAgent.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('videoAgent.addProxy') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="proxyList" stripe class="tech-table">
        <el-table-column prop="name" :label="t('videoAgent.proxyName')" min-width="120">
          <template #default="{ row }">
            <div class="proxy-name">
              <el-icon class="camera-icon"><VideoCamera /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('videoAgent.source')" min-width="150">
          <template #default="{ row }">
            <span class="ip-address">{{ row.sourceIp }}:{{ row.sourcePort }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('videoAgent.target')" min-width="150">
          <template #default="{ row }">
            <span class="ip-address">{{ row.targetIp }}:{{ row.targetPort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mode" :label="t('videoAgent.mode')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.mode === 'PROXY' ? 'primary' : 'success'" size="small">
              {{ row.mode === 'PROXY' ? t('videoAgent.proxy') : t('videoAgent.forward') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('videoAgent.status')" width="100">
          <template #default="{ row }">
            <div class="status-indicator" :class="{ active: row.status === 'ACTIVE' }">
              <span class="dot"></span>
              {{ row.status === 'ACTIVE' ? t('videoAgent.active') : t('videoAgent.inactive') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('videoAgent.deleteConfirm')" @confirm="handleDelete(row.id)">
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
      :title="isEdit ? t('videoAgent.editTitle') : t('videoAgent.addTitle')"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('videoAgent.proxyName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('videoAgent.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('videoAgent.protocol')" prop="protocol">
          <el-select v-model="formData.protocol" class="w-full">
            <el-option label="RTSP" value="RTSP" />
            <el-option label="RTMP" value="RTMP" />
            <el-option label="HLS" value="HLS" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('videoAgent.sourceIp')" prop="sourceIp">
          <el-input v-model="formData.sourceIp" :placeholder="t('videoAgent.ipPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('videoAgent.sourcePort')" prop="sourcePort">
          <el-input-number v-model="formData.sourcePort" :min="1" :max="65535" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('videoAgent.targetIp')" prop="targetIp">
          <el-input v-model="formData.targetIp" :placeholder="t('videoAgent.ipPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('videoAgent.targetPort')" prop="targetPort">
          <el-input-number v-model="formData.targetPort" :min="1" :max="65535" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('videoAgent.mode')" prop="mode">
          <el-radio-group v-model="formData.mode">
            <el-radio value="PROXY">{{ t('videoAgent.proxy') }}</el-radio>
            <el-radio value="FORWARD">{{ t('videoAgent.forward') }}</el-radio>
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
import { VideoCamera, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type ProxyMode = 'PROXY' | 'FORWARD'
type ProxyStatus = 'ACTIVE' | 'INACTIVE'
type VideoProtocol = 'RTSP' | 'RTMP' | 'HLS'

interface VideoProxy {
  id: string
  name: string
  sourceIp: string
  sourcePort: number
  targetIp: string
  targetPort: number
  mode: ProxyMode
  status: ProxyStatus
  protocol: VideoProtocol
}

interface VideoProxyFormData {
  id?: string
  name: string
  sourceIp: string
  sourcePort: number
  targetIp: string
  targetPort: number
  mode: ProxyMode
  protocol: VideoProtocol
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const proxyList = ref<VideoProxy[]>([
  { id: '1', name: 'Camera-01', sourceIp: '192.168.1.100', sourcePort: 554, targetIp: '10.0.0.50', targetPort: 8554, mode: 'PROXY', status: 'ACTIVE', protocol: 'RTSP' },
  { id: '2', name: 'Camera-02', sourceIp: '192.168.1.101', sourcePort: 554, targetIp: '10.0.0.51', targetPort: 8554, mode: 'FORWARD', status: 'INACTIVE', protocol: 'RTSP' }
])

const formData = reactive<VideoProxyFormData>({
  id: undefined,
  name: '',
  sourceIp: '',
  sourcePort: 554,
  targetIp: '',
  targetPort: 554,
  mode: 'PROXY',
  protocol: 'RTSP'
})

// IP validation
const ipValidator = (_rule: any, value: string, callback: any) => {
  const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
  if (!value) {
    callback(new Error(t('videoAgent.ipRequired')))
  } else if (!ipRegex.test(value)) {
    callback(new Error(t('videoAgent.ipFormatError')))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  name: [{ required: true, message: t('videoAgent.nameRequired'), trigger: 'blur' }],
  sourceIp: [{ required: true, validator: ipValidator, trigger: 'blur' }],
  targetIp: [{ required: true, validator: ipValidator, trigger: 'blur' }],
  sourcePort: [{ required: true, message: t('videoAgent.portRequired'), trigger: 'blur' }],
  targetPort: [{ required: true, message: t('videoAgent.portRequired'), trigger: 'blur' }]
}

// Methods
const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: undefined,
    name: '',
    sourceIp: '',
    sourcePort: 554,
    targetIp: '',
    targetPort: 554,
    mode: 'PROXY',
    protocol: 'RTSP'
  })
  dialogVisible.value = true
}

const handleEdit = (row: VideoProxy) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    sourceIp: row.sourceIp,
    sourcePort: row.sourcePort,
    targetIp: row.targetIp,
    targetPort: row.targetPort,
    mode: row.mode,
    protocol: row.protocol
  })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = proxyList.value.findIndex(item => item.id === id)
  if (index > -1) {
    proxyList.value.splice(index, 1)
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const proxy = proxyList.value.find(item => item.id === formData.id)
      if (proxy) {
        Object.assign(proxy, formData)
      }
      ElMessage.success(t('common.success'))
    } else {
      const newProxy: VideoProxy = {
        id: Date.now().toString(),
        name: formData.name,
        sourceIp: formData.sourceIp,
        sourcePort: formData.sourcePort,
        targetIp: formData.targetIp,
        targetPort: formData.targetPort,
        mode: formData.mode,
        status: 'ACTIVE',
        protocol: formData.protocol
      }
      proxyList.value.push(newProxy)
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
.video-agent {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .wave-animation {
      width: 100%;
      height: 100%;
      background:
        radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 70%);
      animation: wave 8s ease-in-out infinite;
    }
  }

  @keyframes wave {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
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
    .proxy-name {
      display: flex;
      align-items: center;
      gap: 8px;

      .camera-icon {
        color: $primary-color;
      }
    }

    .ip-address {
      font-family: 'Courier New', monospace;
      color: $primary-color;
      background: rgba(0, 212, 255, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f56c6c;
      }

      &.active .dot {
        background: #67c23a;
        animation: blink 1s ease-in-out infinite;
      }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
