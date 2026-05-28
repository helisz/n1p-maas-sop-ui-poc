// [AI_START TIMESTAMP=2025-07-21 11:30:00]

export function $getAccountStatistics() {
  return apiFetch<AccountStatisticsDTO>('/api/v1/admin/acc/accounts/statistic', {
    method: 'GET',
  });
}

// [AI_END LINES=7 TIMESTAMP=2025-07-21 11:30:00]
