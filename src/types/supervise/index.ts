// Supervise Types

export interface SysInfoData {
  cpu: number
  memory: number
  disk: number
  uptime: string
  hostname: string
  ip: string
}

export interface GapDipData {
  id: string
  name: string
  status: string
  ip: string
  lastUpdate: string
}

export interface GapFileSyncData {
  id: string
  sourcePath: string
  targetPath: string
  status: string
  lastSync: string
}

export interface GapInethData {
  id: string
  interface: string
  ip: string
  status: string
  rxBytes: number
  txBytes: number
}

export interface GapProtocolData {
  id: string
  protocol: string
  connections: number
  status: string
}

export interface GapUserData {
  id: string
  username: string
  loginTime: string
  ip: string
  status: string
}

export interface PathCheckData {
  id: string
  path: string
  status: string
  latency: number
  lastCheck: string
}

// Aliases for backward compatibility
export type GapDipItem = GapDipData
export type GapFileSyncItem = GapFileSyncData
export type GapInethItem = GapInethData
export type GapProtocolItem = GapProtocolData
export type GapUserItem = GapUserData
export type PathCheckItem = PathCheckData
