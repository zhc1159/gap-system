<!-- ===========================================
     CommonTable - Reusable Table Component
     =========================================== -->

<template>
  <div class="common-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      :highlight-current-row="highlightCurrentRow"
      :empty-text="emptyText || t('common.noData')"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
    >
      <!-- Selection column -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        align="center"
      />

      <!-- Index column -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :label="t('common.index')"
        width="60"
        align="center"
      />

      <!-- Dynamic columns -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :align="col.align || 'left'"
        :show-overflow-tooltip="col.showOverflowTooltip !== false"
      >
        <template #default="{ row }">
          <!-- Status tag -->
          <template v-if="col.type === 'status'">
            <el-tag
              :type="getStatusType(row[col.prop], col.statusMap)"
              size="small"
            >
              {{ getStatusLabel(row[col.prop], col.statusMap) }}
            </el-tag>
          </template>
          <!-- Boolean -->
          <template v-else-if="col.type === 'boolean'">
            <el-tag :type="row[col.prop] ? 'success' : 'danger'" size="small">
              {{ row[col.prop] ? t('common.yes') : t('common.no') }}
            </el-tag>
          </template>
          <!-- Date time -->
          <template v-else-if="col.type === 'datetime'">
            {{ formatDateTime(row[col.prop]) }}
          </template>
          <!-- Default -->
          <template v-else>
            {{ row[col.prop] ?? '-' }}
          </template>
        </template>
      </el-table-column>

      <!-- Actions column -->
      <el-table-column
        v-if="$slots.actions"
        :label="t('common.actions')"
        :width="actionsWidth"
        fixed="right"
        align="center"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index" />
        </template>
      </el-table-column>

      <!-- Empty state -->
      <template #empty>
        <el-empty :description="emptyText || t('common.noData')" />
      </template>
    </el-table>

    <!-- Pagination -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableInstance } from 'element-plus'

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean | 'custom'
  align?: 'left' | 'center' | 'right'
  type?: 'status' | 'boolean' | 'datetime'
  statusMap?: Record<string, { label: string; type: TagType }>
  showOverflowTooltip?: boolean
}

interface Props {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  height?: number | string
  maxHeight?: number | string
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  rowKey?: string | ((row: any) => string)
  defaultExpandAll?: boolean
  highlightCurrentRow?: boolean
  selectable?: boolean
  showIndex?: boolean
  emptyText?: string
  showPagination?: boolean
  total?: number
  page?: number
  limit?: number
  pageSizes?: number[]
  actionsWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stripe: true,
  border: false,
  size: 'default',
  defaultExpandAll: false,
  highlightCurrentRow: false,
  selectable: false,
  showIndex: false,
  showPagination: true,
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100],
  actionsWidth: 180
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:limit': [limit: number]
  'selection-change': [selection: any[]]
  'sort-change': [sort: { prop: string; order: string | null }]
  'row-click': [row: any, column: any, event: MouseEvent]
  'row-dblclick': [row: any, column: any, event: MouseEvent]
  'page-change': [page: number, limit: number]
}>()

const { t } = useI18n()
const tableRef = ref<TableInstance>()

const currentPageModel = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const pageSizeModel = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val)
})

const paginationLayout = computed(() => {
  return 'total, sizes, prev, pager, next, jumper'
})

function handleSelectionChange(selection: any[]) {
  emit('selection-change', selection)
}

function handleSortChange({ prop, order }: { prop: string; order: string | null }) {
  emit('sort-change', { prop, order })
}

function handleRowClick(row: any, column: any, event: MouseEvent) {
  emit('row-click', row, column, event)
}

function handleRowDblclick(row: any, column: any, event: MouseEvent) {
  emit('row-dblclick', row, column, event)
}

function handleSizeChange(size: number) {
  emit('page-change', currentPageModel.value, size)
}

function handleCurrentChange(page: number) {
  emit('page-change', page, pageSizeModel.value)
}

function getStatusType(value: any, statusMap?: Record<string, { label: string; type: TagType }>): TagType | undefined {
  if (!statusMap) return 'info'
  return statusMap[String(value)]?.type || 'info'
}

function getStatusLabel(value: any, statusMap?: Record<string, { label: string; type: TagType }>): string {
  if (!statusMap) return String(value)
  return statusMap[String(value)]?.label || String(value)
}

function formatDateTime(date: string | Date): string {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleString()
}

function clearSelection() {
  tableRef.value?.clearSelection()
}

function toggleRowSelection(row: any, selected?: boolean) {
  tableRef.value?.toggleRowSelection(row, selected)
}

defineExpose({
  clearSelection,
  toggleRowSelection,
  tableRef
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.common-table {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  overflow: hidden;

  :deep(.el-table) {
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: #{rgba(0, 212, 255, 0.05)};
    --el-table-header-text-color: #{$text-primary};
    --el-table-text-color: #{$text-secondary};
    --el-table-row-hover-bg-color: #{rgba(0, 212, 255, 0.08)};
    --el-table-border-color: #{$border-color};

    .el-table__inner-wrapper::before {
      display: none;
    }

    th.el-table__cell {
      font-weight: 600;
      background: rgba(0, 212, 255, 0.05) !important;

      .cell {
        color: $text-primary;
      }
    }

    td.el-table__cell {
      .cell {
        color: $text-secondary;
      }
    }

    .el-table__empty-block {
      background: transparent;
    }
  }
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: $spacing-md;
  border-top: 1px solid $border-color;
  background: rgba(0, 212, 255, 0.02);

  :deep(.el-pagination) {
    --el-pagination-bg-color: #{$bg-hover};
    --el-pagination-text-color: #{$text-secondary};
    --el-pagination-button-bg-color: #{$bg-hover};
    --el-pagination-button-color: #{$text-primary};
    --el-pagination-hover-color: #{$primary-color};

    .el-pagination__total,
    .el-pagination__jump {
      color: $text-secondary;
    }

    .btn-prev,
    .btn-next,
    .el-pager li {
      background: $bg-hover;
      color: $text-secondary;
      border: 1px solid $border-color;
      border-radius: $radius-sm;

      &:hover {
        color: $primary-color;
        border-color: $primary-color;
      }

      &.is-active {
        background: $gradient-primary;
        color: white;
        border-color: transparent;
      }
    }
  }
}
</style>
