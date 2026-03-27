<!-- ===========================================
     UserDialog.vue - Add/Edit User Dialog
     =========================================== -->

<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? t('users.add') : t('users.edit')"
    width="500px"
    class="user-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="localForm"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item :label="t('users.form.username')" prop="username">
        <el-input v-model="localForm.username" :disabled="type === 'edit'" />
      </el-form-item>

      <el-form-item :label="t('users.form.password')" prop="pwd">
        <el-input v-model="localForm.pwd" type="password" show-password />
      </el-form-item>

      <el-form-item :label="t('users.form.confirmPassword')" prop="pwdAgain">
        <el-input v-model="localForm.pwdAgain" type="password" show-password />
      </el-form-item>

      <el-form-item :label="t('users.form.authType')" prop="authType">
        <el-select v-model="localForm.authType" style="width: 100%">
          <el-option :label="t('users.form.super')" value="super" />
          <el-option :label="t('users.form.deputy')" value="deputy" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('users.form.permissions')" prop="authList">
        <el-checkbox-group v-model="localForm.authList">
          <el-checkbox v-for="auth in authList" :key="auth" :label="auth" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import type { IAdminUserForm } from '@/types'

interface Props {
  modelValue: boolean
  type: 'add' | 'edit'
  form: IAdminUserForm | null
  authList: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', form: IAdminUserForm): void
}>()

const { t } = useI18n()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const localForm = reactive<IAdminUserForm>({
  username: '',
  pwd: '',
  pwdAgain: '',
  authType: 'deputy',
  authList: []
})

// Form validation rules
const formRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('login.validation.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: '3-20 characters', trigger: 'blur' }
  ],
  pwd: props.type === 'add'
    ? [
        { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
        { min: 6, max: 32, message: '6-32 characters', trigger: 'blur' }
      ]
    : [],
  pwdAgain: [
    {
      validator: (_rule, value, callback) => {
        if (localForm.pwd && value !== localForm.pwd) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  authType: [
    { required: true, message: 'Required', trigger: 'change' }
  ]
}))

// Watch form prop
watch(() => props.form, (newForm) => {
  if (newForm) {
    Object.assign(localForm, newForm)
  }
}, { immediate: true })

// Handle close
function handleClose() {
  formRef.value?.resetFields()
  Object.assign(localForm, {
    username: '',
    pwd: '',
    pwdAgain: '',
    authType: 'deputy',
    authList: []
  })
}

// Handle submit
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      emit('submit', { ...localForm })
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.user-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
  }

  :deep(.el-dialog__header) {
    border-bottom: 1px solid $border-color;
    padding: $spacing-lg;

    .el-dialog__title {
      color: $text-primary;
      font-weight: 600;
    }
  }

  :deep(.el-dialog__body) {
    padding: $spacing-lg;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid $border-color;
    padding: $spacing-lg;
  }

  :deep(.el-form-item__label) {
    color: $text-secondary;
  }

  :deep(.el-checkbox__label) {
    color: $text-primary;
  }
}
</style>
