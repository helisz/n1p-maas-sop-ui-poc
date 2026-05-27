// [AI_START TIMESTAMP=2025-07-21 10:30:00]

/**
 * 將日期字串格式化為 YYYY-MM-DD HH:MM:SS
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return dateStr;
  }
}

// [AI_END LINES=15 TIMESTAMP=2025-07-21 10:30:00]
