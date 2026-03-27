<!-- ===========================================
     DiagnosticTools.vue - Network Diagnostic Tools
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.diagTool.title')"
      titleEn="Diagnostic Tools"
      :icon="Monitor"
    />

    <el-card class="tech-card">
      <!-- Tool Tabs -->
      <el-tabs v-model="activeTool" class="tech-tabs" @tab-change="handleToolChange">
        <el-tab-pane :label="t('maintenance.diagTool.ping')" name="ping" />
        <el-tab-pane :label="t('maintenance.diagTool.traceroute')" name="traceroute" />
        <el-tab-pane :label="t('maintenance.diagTool.arp')" name="arp" />
        <el-tab-pane :label="t('maintenance.diagTool.tcpdump')" name="tcpdump" />
        <el-tab-pane :label="t('maintenance.diagTool.tcping')" name="tcping" />
      </el-tabs>

      <!-- Parameters Config -->
      <div class="params-section">
        <!-- Ping/Traceroute Parameters -->
        <div v-if="activeTool === 'ping' || activeTool === 'traceroute'" class="param-group">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.networkInterface') }}</label>
                <el-select v-model="params.orient" placeholder="Select interface" style="width: 100%">
                  <el-option label="ALL_IN" value="ALL_IN" />
                  <el-option label="ALL_OUT" value="ALL_OUT" />
                  <el-option
                    v-for="(name, key) in ethMap"
                    :key="key"
                    :label="name"
                    :value="key"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.ipAddress') }}</label>
                <el-input
                  v-model="params.addr"
                  placeholder="IPv4/IPv6 or domain"
                  @input="validateInput"
                />
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- ARP Parameters -->
        <div v-else-if="activeTool === 'arp'" class="param-group">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.networkInterface') }}</label>
                <el-select v-model="params.orient" placeholder="Select interface" style="width: 100%">
                  <el-option label="ALL_IN" value="ALL_IN" />
                  <el-option label="ALL_OUT" value="ALL_OUT" />
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Tcpdump Parameters -->
        <div v-else-if="activeTool === 'tcpdump'" class="param-group">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.networkInterface') }}</label>
                <el-select v-model="params.orient" placeholder="Select" style="width: 100%">
                  <el-option label="default" value="default" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.protocol') }}</label>
                <el-select v-model="params.protocol" placeholder="Select" style="width: 100%">
                  <el-option label="All" value="all" />
                  <el-option label="TCP" value="TCP" />
                  <el-option label="UDP" value="UDP" />
                  <el-option label="ICMP" value="ICMP" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.packetCount') }} (1-50)</label>
                <el-input-number
                  v-model="params.pkg"
                  :min="1"
                  :max="50"
                  style="width: 100%"
                />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 15px">
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.timeout') }} (10-30s)</label>
                <el-input-number
                  v-model="params.exp"
                  :min="10"
                  :max="30"
                  style="width: 100%"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.ipAddress') }} (Optional)</label>
                <el-input v-model="params.addr" placeholder="IPv4/IPv6" />
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Tcping Parameters -->
        <div v-else-if="activeTool === 'tcping'" class="param-group">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.networkInterface') }}</label>
                <el-select v-model="params.where" placeholder="Select" style="width: 100%">
                  <el-option :label="t('maintenance.diagTool.internal')" value="in" />
                  <el-option :label="t('maintenance.diagTool.external')" value="out" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.ipAddress') }}</label>
                <el-input v-model="params.addr" placeholder="IPv4/IPv6" />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="param-item">
                <label>{{ t('maintenance.diagTool.port') }} (1-65535)</label>
                <el-input-number
                  v-model="params.port"
                  :min="1"
                  :max="65535"
                  style="width: 100%"
                />
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-button
            type="primary"
            class="tech-button"
            :loading="isRunning"
            @click="handleStart"
          >
            <el-icon><VideoPlay /></el-icon>
            {{ isRunning ? t('maintenance.diagTool.running') : t('maintenance.diagTool.start') }}
          </el-button>

          <el-button
            type="danger"
            class="tech-button"
            :disabled="!isRunning"
            @click="handleStop"
          >
            <el-icon><VideoPause /></el-icon>
            {{ t('maintenance.diagTool.stop') }}
          </el-button>
        </div>
      </div>

      <!-- Diagnostic Results -->
      <div class="result-terminal">
        <div class="terminal-header">
          <span class="terminal-dot red"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot green"></span>
          <span class="terminal-title">{{ t('maintenance.diagTool.result') }}</span>
        </div>
        <el-scrollbar class="terminal-body" ref="scrollbarRef">
          <div v-for="(line, index) in resultLines" :key="index" class="terminal-line">
            <span class="line-number">{{ index + 1 }}</span>
            <span class="line-content">{{ line }}</span>
          </div>
          <div v-if="resultLines.length === 0" class="empty-state">
            No diagnostic results
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Monitor, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Interfaces
interface DiagParams {
  cmd_head: string
  orient: string
  addr: string
  addr_type: string
  where: string
  protocol: string
  pkg: number
  exp: number
  port: number
}

// State
const activeTool = ref<string>('ping')
const isRunning = ref(false)
const resultLines = ref<string[]>([])
const ethMap = ref<Record<string, string>>({
  eth0: 'eth0 - Internal',
  eth1: 'eth1 - External',
  eth2: 'eth2 - DMZ'
})
const scrollbarRef = ref()

// Parameters
const params = reactive<DiagParams>({
  cmd_head: 'ping',
  orient: '',
  addr: '',
  addr_type: 'IPv4',
  where: 'in',
  protocol: 'all',
  pkg: 10,
  exp: 30,
  port: 80
})

let pollTimer: number | null = null
let pollCount = 0

// Methods
function handleToolChange(tool: string) {
  if (isRunning.value) {
    handleStop()
  }
  resultLines.value = []
  activeTool.value = tool
  params.cmd_head = tool
}

function validateParams(): boolean {
  const { pkg, exp, port } = params

  if (activeTool.value === 'tcpdump') {
    if (pkg < 1 || pkg > 50) {
      ElMessage.error('Packet count must be between 1-50')
      return false
    }
    if (exp < 10 || exp > 30) {
      ElMessage.error('Timeout must be between 10-30')
      return false
    }
  }

  if (activeTool.value === 'tcping') {
    if (port < 1 || port > 65535) {
      ElMessage.error('Port must be between 1-65535')
      return false
    }
  }

  return true
}

function validateInput(value: string) {
  params.addr = value.replace(/[^a-zA-Z0-9:.-]/g, '')
}

async function handleStart() {
  if (!validateParams()) return

  isRunning.value = true
  resultLines.value = []
  pollCount = 0

  // Simulate diagnostic output
  startSimulation()
}

function startSimulation() {
  const mockOutputs = getMockOutputs()

  pollTimer = window.setInterval(() => {
    if (pollCount < mockOutputs.length) {
      resultLines.value.push(mockOutputs[pollCount])
      pollCount++

      // Auto scroll to bottom
      nextTick(() => {
        if (scrollbarRef.value?.wrap) {
          scrollbarRef.value.setScrollTop(scrollbarRef.value.wrap.scrollHeight)
        }
      })
    } else {
      if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
      isRunning.value = false
    }
  }, 500)
}

function getMockOutputs(): string[] {
  switch (activeTool.value) {
    case 'ping':
      return [
        'PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.',
        '64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.123 ms',
        '64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.098 ms',
        '64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.105 ms',
        '64 bytes from 192.168.1.1: icmp_seq=4 ttl=64 time=0.112 ms',
        '--- 192.168.1.1 ping statistics ---',
        '4 packets transmitted, 4 received, 0% packet loss',
        'rtt min/avg/max/mdev = 0.098/0.109/0.123/0.015 ms'
      ]
    case 'traceroute':
      return [
        'traceroute to 8.8.8.8, 30 hops max, 60 byte packets',
        ' 1  192.168.1.1 (192.168.1.1)  0.521 ms  0.412 ms  0.398 ms',
        ' 2  10.0.0.1 (10.0.0.1)  1.234 ms  1.123 ms  1.089 ms',
        ' 3  * * *',
        ' 4  8.8.8.8 (8.8.8.8)  15.234 ms  15.123 ms  15.089 ms'
      ]
    case 'arp':
      return [
        'Address                  HWtype  HWaddress           Flags Mask            Iface',
        '192.168.1.1              ether   00:0c:29:1a:2b:3c   C                     eth0',
        '192.168.1.2              ether   00:0c:29:1a:2b:3d   C                     eth0',
        '192.168.1.254            ether   00:0c:29:1a:2b:3e   C                     eth0'
      ]
    case 'tcpdump':
      return [
        'tcpdump: verbose output suppressed, use -v or -vv for full protocol decode',
        'listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes',
        '14:30:01.123456 IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [S], seq 1234567890',
        '14:30:01.123789 IP 192.168.1.1.80 > 192.168.1.100.54321: Flags [S.], seq 987654321',
        '14:30:01.124012 IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [.], ack 1',
        '10 packets captured',
        '10 packets received by filter',
        '0 packets dropped by kernel'
      ]
    case 'tcping':
      return [
        'TCPing 192.168.1.1 port 80',
        'Connected to 192.168.1.1 port 80: time=0.123 ms',
        'Connected to 192.168.1.1 port 80: time=0.098 ms',
        'Connected to 192.168.1.1 port 80: time=0.105 ms',
        'Ping statistics: 3 probes sent, 3 successful, 0.00% failed'
      ]
    default:
      return ['Unknown diagnostic tool']
  }
}

function handleStop() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  isRunning.value = false
  ElMessage.success(t('common.success'))
}

// Lifecycle
onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
  }
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
}

.tech-tabs {
  margin-bottom: $spacing-lg;

  :deep(.el-tabs__header) {
    border-bottom: 2px solid $primary-color;
    margin-bottom: $spacing-lg;
  }

  :deep(.el-tabs__item) {
    color: $text-muted;
    font-weight: 600;
    transition: all $transition-normal;
    padding: 0 30px;

    &.is-active {
      color: $primary-color;
      background: $gradient-glow;
    }

    &:hover {
      color: $primary-color;
    }
  }
}

.params-section {
  padding: $spacing-lg;
  background: rgba(0, 212, 255, 0.02);
  border-radius: $radius-lg;
  margin-bottom: $spacing-lg;
}

.param-group {
  margin-bottom: $spacing-md;
}

.param-item {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-sm;

  label {
    margin-bottom: $spacing-xs;
    font-weight: 600;
    color: $primary-color;
    font-size: $font-size-sm;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: $spacing-lg;
  margin-top: $spacing-lg;
}

.tech-button {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(0, 212, 255, 0.5);
  transition: all $transition-normal;
  min-width: 120px;

  &:hover:not(:disabled) {
    box-shadow: $shadow-glow;
    transform: translateY(-2px);
  }
}

.result-terminal {
  background: $bg-darker;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-glow;
}

.terminal-header {
  background: linear-gradient(90deg, $bg-secondary 0%, $bg-card 100%);
  padding: $spacing-sm $spacing-md;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: $spacing-xs;

  &.red { background: #FF5F56; }
  &.yellow { background: #FFBD2E; }
  &.green { background: #27C93F; }
}

.terminal-title {
  margin-left: $spacing-md;
  color: $primary-color;
  font-weight: 600;
}

.terminal-body {
  height: 300px;
  padding: $spacing-md;
}

.terminal-line {
  display: flex;
  line-height: 1.8;
  font-family: $font-family-mono;
  font-size: $font-size-xs;
}

.line-number {
  color: $secondary-color;
  margin-right: $spacing-md;
  min-width: 30px;
  user-select: none;
}

.line-content {
  color: $text-secondary;
  word-break: break-all;
}

.empty-state {
  text-align: center;
  color: $text-muted;
  padding: 50px 0;
}

@media (max-width: 768px) {
  .tech-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
  }

  .param-group .el-col {
    margin-bottom: $spacing-sm;
  }
}
</style>
