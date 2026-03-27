<!-- ===========================================
     InterfaceConfig.vue - Network Interface Config
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('system.interface.title')"
      titleEn="Interface Config"
      :icon="Setting"
    >
      <template #extra>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          {{ t('common.refresh') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Interface Cards -->
    <div class="interface-grid">
      <div
        v-for="iface in interfaces"
        :key="iface.name"
        class="interface-card"
        :class="{ 'is-active': iface.status === 'up' }"
      >
        <div class="card-header">
          <div class="interface-name">
            <el-icon :class="iface.status === 'up' ? 'status-up' : 'status-down'">
              <SuccessFilled v-if="iface.status === 'up'" />
              <CircleCloseFilled v-else />
            </el-icon>
            <span>{{ iface.name }}</span>
          </div>
          <el-tag :type="iface.status === 'up' ? 'success' : 'danger'" size="small">
            {{ iface.status === 'up' ? 'UP' : 'DOWN' }}
          </el-tag>
        </div>

        <el-divider />

        <div class="card-body">
          <div class="info-row">
            <span class="label">IP {{ t('system.interface.address') || '地址' }}</span>
            <span class="value">{{ iface.ip }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ t('system.interface.mask') }}</span>
            <span class="value">{{ iface.mask }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ t('system.interface.mac') }}</span>
            <span class="value mono">{{ iface.mac }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ t('system.interface.mtu') }}</span>
            <span class="value">{{ iface.mtu }}</span>
          </div>

          <div class="traffic-stats">
            <div class="stat-item rx">
              <el-icon><Download /></el-icon>
              <span>{{ formatBytes(iface.rxBytes) }}</span>
              <span class="stat-label">{{ t('system.interface.rxBytes') }}</span>
            </div>
            <div class="stat-item tx">
              <el-icon><Upload /></el-icon>
              <span>{{ formatBytes(iface.txBytes) }}</span>
              <span class="stat-label">{{ t('system.interface.txBytes') }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <el-button type="primary" text size="small" @click="handleEdit(iface)">
            <el-icon><Edit /></el-icon>
            {{ t('common.edit') }}
          </el-button>
          <el-button
            :type="iface.status === 'up' ? 'danger' : 'success'"
            text
            size="small"
            @click="handleToggleStatus(iface)"
          >
            {{ iface.status === 'up' ? '禁用' : '启用' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog v-model="editVisible" :title="t('common.edit') + ' - ' + (currentInterface?.name || '')" width="500px">
      <el-form v-if="editForm" :model="editForm" label-width="100px">
        <el-form-item label="IP {{ t('system.interface.address') || '地址' }}">
          <el-input v-model="editForm.ip" placeholder="192.168.1.1" />
        </el-form-item>
        <el-form-item :label="t('system.interface.mask')">
          <el-input v-model="editForm.mask" placeholder="255.255.255.0" />
        </el-form-item>
        <el-form-item :label="t('system.interface.mtu')">
          <el-input-number v-model="editForm.mtu" :min="576" :max="9000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Setting,
  Refresh,
  Edit,
  Download,
  Upload,
  SuccessFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Interface data
const interfaces = ref<any[]>([])
const editVisible = ref(false)
const currentInterface = ref<any>(null)
const editForm = reactive({
  ip: '',
  mask: '',
  mtu: 1500
})

// Generate mock data
function generateMockData(): any[] {
  return [
    {
      name: 'eth0',
      status: 'up',
      ip: '192.168.1.1',
      mask: '255.255.255.0',
      mac: '00:0c:29:1a:2b:3c',
      mtu: 1500,
      rxBytes: 1024 * 1024 * 512 + Math.random() * 1024 * 1024 * 100,
      txBytes: 1024 * 1024 * 256 + Math.random() * 1024 * 1024 * 50
    },
    {
      name: 'eth1',
      status: 'up',
      ip: '10.0.0.1',
      mask: '255.255.0.0',
      mac: '00:0c:29:1a:2b:3d',
      mtu: 1500,
      rxBytes: 1024 * 1024 * 128 + Math.random() * 1024 * 1024 * 30,
      txBytes: 1024 * 1024 * 64 + Math.random() * 1024 * 1024 * 20
    },
    {
      name: 'eth2',
      status: 'down',
      ip: '172.16.0.1',
      mask: '255.255.0.0',
      mac: '00:0c:29:1a:2b:3e',
      mtu: 1500,
      rxBytes: 0,
      txBytes: 0
    }
  ]
}

// Format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Fetch data
function fetchData() {
  interfaces.value = generateMockData()
}

// Handle refresh
function handleRefresh() {
  fetchData()
  ElMessage.success(t('common.success'))
}

// Handle edit
function handleEdit(iface: any) {
  currentInterface.value = iface
  editForm.ip = iface.ip
  editForm.mask = iface.mask
  editForm.mtu = iface.mtu
  editVisible.value = true
}

// Handle save
function handleSave() {
  if (currentInterface.value) {
    currentInterface.value.ip = editForm.ip
    currentInterface.value.mask = editForm.mask
    currentInterface.value.mtu = editForm.mtu
    ElMessage.success(t('common.saveSuccess'))
  }
  editVisible.value = false
}

// Handle toggle status
function handleToggleStatus(iface: any) {
  iface.status = iface.status === 'up' ? 'down' : 'up'
  ElMessage.success(`${iface.name} ${iface.status === 'up' ? '已启用' : '已禁用'}`)
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.interface-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $spacing-lg;
}

.interface-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  transition: all $transition-normal;

  &:hover {
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: $shadow-glow;
  }

  &.is-active {
    border-color: rgba(16, 185, 129, 0.3);

    .card-header {
      background: rgba(16, 185, 129, 0.05);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;

    .interface-name {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;

      .status-up { color: $success-color; }
      .status-down { color: $danger-color; }
    }
  }

  .el-divider {
    margin: 0;
  }

  .card-body {
    padding: $spacing-md $spacing-lg;

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: $spacing-xs 0;

      .label {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .value {
        color: $text-primary;
        font-size: $font-size-sm;

        &.mono {
          font-family: $font-family-mono;
        }
      }
    }

    .traffic-stats {
      display: flex;
      gap: $spacing-lg;
      margin-top: $spacing-md;
      padding-top: $spacing-md;
      border-top: 1px solid $border-color;

      .stat-item {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-size: $font-size-sm;

        &.rx { color: $success-color; }
        &.tx { color: $primary-color; }

        .stat-label {
          color: $text-muted;
          font-size: $font-size-xs;
          margin-left: 4px;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background: rgba(0, 212, 255, 0.02);
    border-top: 1px solid $border-color;
  }
}
</style>
