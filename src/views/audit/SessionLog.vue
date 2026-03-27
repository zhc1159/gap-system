<!-- ===========================================
     SessionLog.vue - Session Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.session.title')"
      titleEn="Session Logs"
      :icon="User"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('audit.session.user')">
        <el-input v-model="searchForm.user" placeholder="用户名" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('audit.session.clientIP')">
        <el-input v-model="searchForm.clientIP" placeholder="客户端IP" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item :label="t('audit.session.status')">
        <el-select v-model="searchForm.status" :placeholder="t('common.all')" clearable style="width: 120px">
          <el-option label="在线" value="online" />
          <el-option label="已离线" value="offline" />
        </el-select>
      </el-form-item>
    </SearchBar>

    <!-- Online Stats -->
    <div class="online-stats">
      <div class="stat-card">
        <el-icon class="stat-icon online"><UserFilled /></el-icon>
        <div class="stat-content">
          <span class="stat-value">{{ onlineCount }}</span>
          <span class="stat-label">当前在线</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #user="{ row }">
        <div class="user-cell">
          <el-avatar :size="28">{{ row.user.charAt(0).toUpperCase() }}</el-avatar>
          <span>{{ row.user }}</span>
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small">
          {{ row.status === 'online' ? '在线' : '已离线' }}
        </el-tag>
      </template>
      <template #duration="{ row }">
        {{ formatDuration(row.duration) }}
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'online'" type="danger" text size="small" @click="handleForceLogout(row)">
          强制下线
        </el-button>
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, UserFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  user: '',
  clientIP: '',
  status: ''
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Online count
const onlineCount = computed(() => tableData.value.filter(d => d.status === 'online').length)

// Table columns
const columns: TableColumn[] = [
  { prop: 'user', label: '用户', width: 180 },
  { prop: 'loginTime', label: '登录时间', width: 170, type: 'datetime' },
  { prop: 'logoutTime', label: '登出时间', width: 170, type: 'datetime' },
  { prop: 'duration', label: '会话时长', width: 120 },
  { prop: 'clientIP', label: '客户端IP', width: 140 },
  { prop: 'status', label: '状态', width: 100 }
]

// Mock data generator
function generateMockData(): any[] {
  const users = ['admin', 'sysadm', 'auditor', 'operator', 'test']
  const statuses = ['online', 'offline']

  return Array.from({ length: 100 }, (_, i) => {
    const loginTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    const isOnline = i < 10
    const duration = isOnline ? Date.now() - loginTime.getTime() : Math.random() * 8 * 60 * 60 * 1000

    return {
      id: i + 1,
      user: users[Math.floor(Math.random() * users.length)],
      loginTime: loginTime.toLocaleString(),
      logoutTime: isOnline ? '-' : new Date(loginTime.getTime() + duration).toLocaleString(),
      duration,
      clientIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: isOnline ? 'online' : statuses[Math.floor(Math.random() * statuses.length)]
    }
  })
}

// Format duration
function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const mockData = generateMockData()
    let filtered = [...mockData]

    if (searchForm.user) filtered = filtered.filter(item => item.user.includes(searchForm.user))
    if (searchForm.clientIP) filtered = filtered.filter(item => item.clientIP.includes(searchForm.clientIP))
    if (searchForm.status) filtered = filtered.filter(item => item.status === searchForm.status)

    total.value = filtered.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = filtered.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

// Force logout
async function handleForceLogout(row: any) {
  try {
    await ElMessageBox.confirm(`确定要强制用户 "${row.user}" 下线吗？`, '提示', { type: 'warning' })
    row.status = 'offline'
    ElMessage.success('已强制下线')
  } catch { }
}

// Handlers
function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { Object.assign(searchForm, { user: '', clientIP: '', status: '' }); handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }

// Lifecycle
onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.online-stats {
  margin-bottom: $spacing-lg;

  .stat-card {
    display: inline-flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: $radius-lg;

    .stat-icon { font-size: 28px; color: $success-color; }
    .stat-value { font-size: $font-size-2xl; font-weight: 700; color: $success-color; }
    .stat-label { font-size: $font-size-sm; color: $text-secondary; }
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}
</style>
