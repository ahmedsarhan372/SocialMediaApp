import Swal, { type SweetAlertOptions } from 'sweetalert2'

export function showThemedAlert(options: SweetAlertOptions) {
  const isDark =
    document.documentElement.classList.contains('dark') ||
    localStorage.getItem('theme') === 'dark'

  return Swal.fire({
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#111827',
    confirmButtonColor: isDark ? '#2563eb' : '#1d4ed8',
    cancelButtonColor: isDark ? '#374151' : '#6b7280',
    ...options,
  })
}
