// [AI_START TIMESTAMP=2025-06-20 10:00:00]

export function $login(data: LoginRequest) {
  return apiFetch<LoginResponse>('/api/v1/admin/acc/login', {
    method: 'POST',
    body: data,
  });
}

// [AI_END LINES=8 TIMESTAMP=2025-06-20 10:00:00]
