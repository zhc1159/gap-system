<!-- ===========================================
     OutAtkLog.vue - Outbound Attack Log View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.outAtk.title')"
      titleEn="Outbound Attack Logs"
      :icon="Warning"
    />

    <!-- Search Bar -->
    <SearchBar @search="handleSearch" @reset="handleReset">
      <el-form-item :label="t('common.time')">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
        />
      </el-form-item>
    </SearchBar>

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
      <template #attackTime="{ row }">
        {{ row[0] }} {{ row[1] }}
      </template>
      <template #attackType="{ row }">
        <el-tag v-if="row[5] === 'TCP'" type="danger" size="small" effect="dark">SYN</el-tag>
        <el-tag v-else type="warning" size="small" effect="dark">{{ row[5] }}</el-tag>
      </template>
      <template #attackSource="{ row }">
        {{ row[7] }}
      </template>
      <template #attackDest="{ row }">
        {{ row[9] }}
      </template>
    </CommonTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Warning } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Search form
const searchForm = reactive({
  dateRange: null as [Date, Date] | null
})

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<string[][]>([])

// Table columns - Simplified 4 columns
const columns: TableColumn[] = [
  { prop: 'attackTime', label: '时间', width: 180 },
  { prop: 'attackType', label: '警告类型', width: 120 },
  { prop: 'attackSource', label: '攻击来源', width: 180 },
  { prop: 'attackDest', label: '攻击目的', minWidth: 180 }
]

// Mock data generator - Array format
function generateMockData(): string[][] {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP']
  const ips = () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  return Array.from({ length: 80 }, () => {
    const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    return [
      date.toLocaleDateString(), // row[0] - date
      date.toLocaleTimeString(), // row[1] - time
      '', '', '', // row[2-4] - placeholder
      protocols[Math.floor(Math.random() * protocols.length)], // row[5] - protocol
      '', // row[6] - placeholder
      ips(), // row[7] - source
      '', // row[8] - placeholder
      ips() // row[9] - dest
    ]
  })
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    const data = generateMockData()
    total.value = data.length
    const start = (pagination.page - 1) * pagination.limit
    tableData.value = data.slice(start, start + pagination.limit)
    loading.value = false
  }, 400)
}

function handleSearch() { pagination.page = 1; fetchData() }
function handleReset() { searchForm.dateRange = null; handleSearch() }
function handlePageChange(page: number, limit: number) { pagination.page = page; pagination.limit = limit; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
