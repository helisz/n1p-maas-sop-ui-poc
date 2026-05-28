// [AI_START TIMESTAMP=2025-06-20 10:00:00]

export function $logout() {
  return apiFetch<void>('/api/v1/admin/acc/logout', {
    method: 'POST',
  });
}

// [AI_END LINES=7 TIMESTAMP=2025-06-20 10:00:00]
