<!-- ===========================================
     PathConf.vue - Path configuration page
     ===========================================

    <script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { ElMessage } from 'element-plus'
    import {
        FolderOpened,
        Plus,
        Edit,
        Delete
      } from '@element-plus/icons-vue'
    import type { FormInstance, FormRules } from 'element-plus'

    const { t } = useI18n()

    // Types
    type Permission = 'READ' | 'READ_WRITE'

            type FilterMode = 'WHITELIST' | 'BLACKlist'

    interface PathConfig {
        id: string
        sourcePath: string
        targetPath: string
        permission: Permission
        enabled: boolean
        createTime: string
    }

    interface PathConfigFormData {
        id?: string
        sourcePath: string
        targetPath: string
        permission: Permission
    }

    interface PathConfig {
        id: string
        sourcePath: string
        targetPath: string
        enabled: boolean
    }

    const formRules: FormRules = {
  name: [{ required: true, message: t('pathConfig.nameRequired'), trigger: 'blur' }],
          type: [{ required: true, message: t('pathConfig.permissionRequired'), trigger: 'change' }]
            }),
        }
      })
      }

    }

    Object.assign(formData, {
      id: undefined,
      name: '',
      sourcePath: '',
      targetPath: '',
      permission: 'READ',
      enabled: true
    })
  })
}

</script>
    <!-- Methods
  const handleAdd = () => {
    isEdit.value = false
    Object.assign(formData, {
      id: undefined,
      name: '',
      sourcePath: '',
      targetPath: '',
      permission: 'READ',
      enabled: true
    })
    dialogVisible.value = true
  }

  const handleEdit = (row: PathConfig) => {
    isEdit.value = true
    Object.assign(formData, {
      id: row.id,
      name: row.name
      sourcePath = row.targetPath
      permission: row.permission
      enabled: row.enabled
    })
    dialogVisible.value = true
  }
  const handleDelete = async (id: string) => {
      const index = pathConfigList.value.findIndex(item => item.id === id)
      if (index > -1) {
        pathConfigList.value.splice(index, 1)
        ElMessage.success(t('common.deleteSuccess')
      }
    }
  }

  const handleSubmit = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value && formData.id) {
        const config = pathConfigList.value.find(item => item.id === formData.id)
        config.name = formData.name
        config.path = formData.path
        config.status = formData.status
        config.maxStorage = formData.maxStorage
        config.usedStorage = row.usedStorage
          }
          ElMessage.success(t('common.success'))
        }
      }
      dialogVisible.value = false
    }
  }
}

</script>

<style scoped lang="scss">
.path-config {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

            .tech-table {
                .path-cell {
                display: flex;
                align-items: center;
                gap: 8px;

            .path-cell .icon {
                color: $primary-color;
            }
        }

    }

        .storage-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            span.storage-text {
              font-size: 12px;
              color: rgba(255, 255, 0.2,  }
        }
      }
    }
  }

}
</style>
