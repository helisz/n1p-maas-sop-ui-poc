// [AI_START TIMESTAMP=2025-06-20 10:00:00]

export function $listAccounts(params: ListAccountRequest) {
  return apiFetch<PageResult<AccountListItemDTO>>('/api/v1/admin/acc/accounts', {
    method: 'GET',
    params,
  });
}

// [AI_END LINES=8 TIMESTAMP=2025-06-20 10:00:00]
