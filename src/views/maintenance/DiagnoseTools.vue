<!-- ===========================================
DiagnoseTools.vue - Diagnostic Tools
=========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.diagnose.title')"
      titleEn="Diagnostic Tools"
      :icon="Tools"
    />

    <!-- Tool Tabs -->
    <el-tabs v-model="activeTool" class="tool-tabs">
      <!-- Ping Test -->
      <el-tab-pane name="ping">
        <template #label>
          <span class="tab-label">
            <el-icon><Connection /></el-icon>
            {{ t('maintenance.diagnose.ping') }}
          </span>
        </template>
        <div class="tool-panel">
          <el-form :inline="true" @submit.prevent="runPing">
            <el-form-item label="目标地址">
              <el-input v-model="pingForm.host" placeholder="IP 或域名" style="width: 250px" />
            </el-form-item>
            <el-form-item label="次数">
              <el-input-number v-model="pingForm.count" :min="1" :max="10" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runPing" :loading="pingLoading">
                <el-icon><VideoPlay /></el-icon>
                执行
              </el-button>
            </el-form-item>
          </el-form>
          <div class="result-area" v-loading="pingLoading">
            <pre v-if="pingResult">{{ pingResult }}</pre>
            <el-empty v-else description="执行 Ping 测试查看结果" />
          </div>
        </div>
      </el-tab-pane>

      <!-- Traceroute -->
      <el-tab-pane name="traceroute">
        <template #label>
          <span class="tab-label">
            <el-icon><TrendCharts /></el-icon>
            {{ t('maintenance.diagnose.traceroute') }}
          </span>
        </template>
        <div class="tool-panel">
          <el-form :inline="true" @submit.prevent="runTraceroute">
            <el-form-item label="目标地址">
              <el-input v-model="tracerouteForm.host" placeholder="IP 或域名" style="width: 250px" />
            </el-form-item>
            <el-form-item label="最大跳数">
              <el-input-number v-model="tracerouteForm.maxHops" :min="5" :max="30" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runTraceroute" :loading="tracerouteLoading">
                <el-icon><VideoPlay /></el-icon>
                执行
              </el-button>
            </el-form-item>
          </el-form>
          <div class="result-area" v-loading="tracerouteLoading">
            <pre v-if="tracerouteResult">{{ tracerouteResult }}</pre>
            <el-empty v-else description="执行路由追踪查看结果" />
          </div>
        </div>
      </el-tab-pane>

      <!-- Port Scan -->
      <el-tab-pane name="portscan">
        <template #label>
          <span class="tab-label">
            <el-icon><Grid /></el-icon>
            {{ t('maintenance.diagnose.portScan') }}
          </span>
        </template>
        <div class="tool-panel">
          <el-form :inline="true" @submit.prevent="runPortScan">
            <el-form-item label="目标地址">
              <el-input v-model="portscanForm.host" placeholder="IP 地址" style="width: 200px" />
            </el-form-item>
            <el-form-item label="端口范围">
              <el-input v-model="portscanForm.ports" placeholder="如: 80,443 或 1-1000" style="width: 150px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runPortScan" :loading="portscanLoading">
                <el-icon><VideoPlay /></el-icon>
                执行
              </el-button>
            </el-form-item>
          </el-form>
          <div class="result-area" v-loading="portscanLoading">
            <el-table v-if="portscanResult.length" :data="portscanResult" style="width: 100%">
              <el-table-column prop="port" label="端口" width="100" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'open' ? 'success' : 'info'" size="small">
                    {{ row.status === 'open' ? '开放' : '关闭' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="service" label="服务" width="150" />
              <el-table-column prop="banner" label="Banner" show-overflow-tooltip />
            </el-table>
            <el-empty v-else description="执行端口扫描查看结果" />
          </div>
        </div>
      </el-tab-pane>

      <!-- DNS Lookup -->
      <el-tab-pane name="dns">
        <template #label>
          <span class="tab-label">
            <el-icon><Search /></el-icon>
            {{ t('maintenance.diagnose.dnsLookup') }}
          </span>
        </template>
        <div class="tool-panel">
          <el-form :inline="true" @submit.prevent="runDnsLookup">
            <el-form-item label="域名">
              <el-input v-model="dnsForm.domain" placeholder="example.com" style="width: 250px" />
            </el-form-item>
            <el-form-item label="查询类型">
              <el-select v-model="dnsForm.type" style="width: 120px">
                <el-option label="A" value="A" />
                <el-option label="AAAA" value="AAAA" />
                <el-option label="MX" value="MX" />
                <el-option label="NS" value="NS" />
                <el-option label="TXT" value="TXT" />
                <el-option label="CNAME" value="CNAME" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runDnsLookup" :loading="dnsLoading">
                <el-icon><VideoPlay /></el-icon>
                执行
              </el-button>
            </el-form-item>
          </el-form>
          <div class="result-area" v-loading="dnsLoading">
            <pre v-if="dnsResult">{{ dnsResult }}</pre>
            <el-empty v-else description="执行 DNS 查询查看结果" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Tool Description -->
    <div class="tool-tips">
      <el-card shadow="never">
        <template #header>
          <span class="tips-title">
            <el-icon><InfoFilled /></el-icon>
            工具说明
          </span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Ping 测试">测试与目标主机的连通性和响应时间</el-descriptions-item>
          <el-descriptions-item label="路由追踪">追踪到达目标主机经过的网络路径</el-descriptions-item>
          <el-descriptions-item label="端口扫描">扫描目标主机开放的端口及服务</el-descriptions-item>
          <el-descriptions-item label="DNS 查询">查询域名的 DNS 解析记录</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Tools,
  Connection,
  TrendCharts,
  Grid,
  Search,
  VideoPlay,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Active tool tab
const activeTool = ref('ping')

// Ping
const pingForm = reactive({ host: '', count: 4 })
const pingLoading = ref(false)
const pingResult = ref('')

// Traceroute
const tracerouteForm = reactive({ host: '', maxHops: 15 })
const tracerouteLoading = ref(false)
const tracerouteResult = ref('')

// Port Scan
const portscanForm = reactive({ host: '', ports: '1-100' })
const portscanLoading = ref(false)
const portscanResult = ref<any[]>([])

// DNS Lookup
const dnsForm = reactive({ domain: '', type: 'A' })
const dnsLoading = ref(false)
const dnsResult = ref('')

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Run Ping
async function runPing() {
  if (!pingForm.host) {
    ElMessage.warning('请输入目标地址')
    return
  }

  pingLoading.value = true
  pingResult.value = ''

  // Simulate ping output
  const lines = [`PING ${pingForm.host} (${mockResolveHost(pingForm.host)}) 56(84) bytes of data.`]

  for (let i = 1; i <= pingForm.count; i++) {
    await delay(300)
    const time = (Math.random() * 50 + 10).toFixed(3)
    lines.push(`64 bytes from ${pingForm.host}: icmp_seq=${i} ttl=64 time=${time} ms`)
    pingResult.value = lines.join('\n')
  }

  const stats = [
    '',
    `--- ${pingForm.host} ping statistics ---`,
    `${pingForm.count} packets transmitted, ${pingForm.count} received, 0% packet loss, time ${pingForm.count * 300}ms`,
    `rtt min/avg/max/mdev = ${(Math.random() * 10 + 5).toFixed(3)}/${(Math.random() * 30 + 20).toFixed(3)}/${(Math.random() * 50 + 40).toFixed(3)}/${(Math.random() * 10).toFixed(3)} ms`
  ]

  pingResult.value = lines.concat(stats).join('\n')
  pingLoading.value = false
}

// Mock resolve host
function mockResolveHost(host: string): string {
  const match = host.match(/^(\d+\.\d+\.\d+\.\d+)$/)
  if (match) return host
  return `93.184.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// Run Traceroute
async function runTraceroute() {
  if (!tracerouteForm.host) {
    ElMessage.warning('请输入目标地址')
    return
  }

  tracerouteLoading.value = true
  tracerouteResult.value = `traceroute to ${tracerouteForm.host}, ${tracerouteForm.maxHops} hops max, 60 byte packets\n`

  const targetIp = mockResolveHost(tracerouteForm.host)
  const hops = Math.floor(Math.random() * 10) + 5

  for (let i = 1; i <= hops; i++) {
    await delay(200)
    const ip = i === hops ? targetIp : `10.${i}.${Math.floor(Math.random() * 255)}.1`
    const time1 = (Math.random() * 20 + 5).toFixed(2)
    const time2 = (Math.random() * 20 + 5).toFixed(2)
    const time3 = (Math.random() * 20 + 5).toFixed(2)
    tracerouteResult.value += ` ${i}  ${ip}  ${time1} ms  ${time2} ms  ${time3} ms\n`
  }

  tracerouteLoading.value = false
}

// Run Port Scan
async function runPortScan() {
  if (!portscanForm.host) {
    ElMessage.warning('请输入目标地址')
    return
  }

  portscanLoading.value = true
  portscanResult.value = []

  // Parse port range
  let ports: number[] = []
  if (portscanForm.ports.includes('-')) {
    const [start, end] = portscanForm.ports.split('-').map(Number)
    ports = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  } else {
    ports = portscanForm.ports.split(',').map(Number)
  }

  // Common services
  const services: Record<number, { name: string; banner: string }> = {
    21: { name: 'FTP', banner: '220 ProFTPD 1.3.5 Server' },
    22: { name: 'SSH', banner: 'SSH-2.0-OpenSSH_7.4' },
    23: { name: 'Telnet', banner: '' },
    25: { name: 'SMTP', banner: '220 mail.local ESMTP Postfix' },
    53: { name: 'DNS', banner: '' },
    80: { name: 'HTTP', banner: 'Apache/2.4.6 (CentOS)' },
    110: { name: 'POP3', banner: '+OK Dovecot ready.' },
    143: { name: 'IMAP', banner: '* OK [CAPABILITY IMAP4rev1] Dovecot ready.' },
    443: { name: 'HTTPS', banner: 'nginx/1.18.0' },
    3306: { name: 'MySQL', banner: '5.7.32 MySQL Community Server' },
    3389: { name: 'RDP', banner: '' },
    5432: { name: 'PostgreSQL', banner: 'PostgreSQL 12.6' },
    6379: { name: 'Redis', banner: 'Redis 6.0.10' },
    8080: { name: 'HTTP-Alt', banner: 'Apache Tomcat/9.0.43' }
  }

  const results: any[] = []

  for (const port of ports.slice(0, 50)) { // Limit to 50 ports
    await delay(50)
    const isOpen = Math.random() > 0.7
    const service = services[port] || { name: 'unknown', banner: '' }

    if (isOpen) {
      results.push({
        port,
        status: 'open',
        service: service.name,
        banner: service.banner || '-'
      })
    }
  }

  portscanResult.value = results.sort((a, b) => a.port - b.port)
  portscanLoading.value = false

  if (results.length === 0) {
    ElMessage.info('未发现开放端口')
  }
}

// Run DNS Lookup
async function runDnsLookup() {
  if (!dnsForm.domain) {
    ElMessage.warning('请输入域名')
    return
  }

  dnsLoading.value = true
  dnsResult.value = ''

  await delay(500)

  const type = dnsForm.type
  const domain = dnsForm.domain
  const ip = mockResolveHost(domain)

  const results: string[] = [
    `; <<>> DiG 9.11.4-P2-RedHat-9.11.4-26.P2.el7 <<>> ${domain} ${type}`,
    `;; global options: +cmd`,
    `;; Got answer:`,
    `;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: ${Math.floor(Math.random() * 65535)}`,
    `;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0`,
    '',
    `;; QUESTION SECTION:`,
    `;${domain}.\t\t\tIN\t${type}`,
    '',
    `;; ANSWER SECTION:`
  ]

  switch (type) {
    case 'A':
      results.push(`${domain}.\t\t300\tIN\tA\t${ip}`)
      break
    case 'AAAA':
      results.push(`${domain}.\t\t300\tIN\tAAAA\t2001:db8::1`)
      break
    case 'MX':
      results.push(`${domain}.\t\t300\tIN\tMX\t10 mail.${domain}.`)
      break
    case 'NS':
      results.push(`${domain}.\t\t300\tIN\tNS\tns1.${domain}.`)
      results.push(`${domain}.\t\t300\tIN\tNS\tns2.${domain}.`)
      break
    case 'TXT':
      results.push(`${domain}.\t\t300\tIN\tTXT\t"v=spf1 include:_spf.${domain} ~all"`)
      break
    case 'CNAME':
      results.push(`${domain}.\t\t300\tIN\tCNAME\twww.${domain}.`)
      break
  }

  results.push('')
  results.push(`;; Query time: ${Math.floor(Math.random() * 50) + 10} msec`)
  results.push(`;; SERVER: 8.8.8.8#53(8.8.8.8)`)
  results.push(`;; WHEN: ${new Date().toDateString()} ${new Date().toTimeString().slice(0, 8)}`)
  results.push(`;; MSG SIZE  rcvd: ${Math.floor(Math.random() * 100) + 50}`)

  dnsResult.value = results.join('\n')
  dnsLoading.value = false
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tool-tabs {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-md;
  margin-bottom: $spacing-lg;

  :deep(.el-tabs__header) {
    margin-bottom: $spacing-md;
    border-bottom: 1px solid $border-color;
  }

  :deep(.el-tabs__item) {
    color: $text-secondary;

    &.is-active {
      color: $primary-color;
    }
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-panel {
  min-height: 300px;
}

.result-area {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;

  pre {
    margin: 0;
    font-family: $font-family-mono;
    font-size: $font-size-sm;
    color: $text-primary;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.6;
  }
}

.tool-tips {
  .el-card {
    background: $bg-card;
    border-color: $border-color;
  }

  .tips-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-weight: 600;
    color: $text-primary;

    .el-icon { color: $primary-color; }
  }

  :deep(.el-descriptions__label) {
    color: $text-secondary;
    font-weight: 600;
  }

  :deep(.el-descriptions__content) {
    color: $text-primary;
  }
}
</style>
