// [AI_START TIMESTAMP=2025-06-20 09:15:00]
export function toFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v instanceof Blob ? v : String(v)));
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}
// [AI_END LINES=14 TIMESTAMP=2025-06-20 09:15:00]
