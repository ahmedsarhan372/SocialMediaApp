import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from '../api/client'
import { changePassword, type ChangePasswordBody } from '../api/auth.api'
import { showThemedAlert } from '../utils/showThemedAlert'

export function useChangePassword(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (values: ChangePasswordBody) =>
      changePassword({ password: values.password, newPassword: values.newPassword }),
    onSuccess: (res) => {
      localStorage.setItem('usertoken', res.data.data.token)
      options?.onSuccess?.()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        void showThemedAlert({ icon: 'error', title: 'Error!', text: err.response?.data.message })
      }
    },
  })
}
