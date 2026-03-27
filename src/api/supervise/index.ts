// Supervise API
import request from '@/utils/request'

export const getSysInfoApi = () => request.get('/api/supervise/sys-info')
export const getSysInfo2Api = () => request.get('/api/supervise/sys-info2')
export const getGapDipApi = () => request.get('/api/supervise/gap-dip')
export const getGapFileSyncApi = () => request.get('/api/supervise/gap-file-sync')
export const getGapInethApi = () => request.get('/api/supervise/gap-ineth')
export const getGapProtocolApi = () => request.get('/api/supervise/gap-protocol')
export const getGapUserApi = () => request.get('/api/supervise/gap-user')
export const getPathCheckApi = () => request.get('/api/supervise/path-check')

// Aliases for backward compatibility
export const getGapDipList = getGapDipApi
export const getGapFileSyncList = getGapFileSyncApi
export const getGapInethList = getGapInethApi
export const getGapProtocolList = getGapProtocolApi
export const getGapUserList = getGapUserApi
export const getPathCheckList = getPathCheckApi
