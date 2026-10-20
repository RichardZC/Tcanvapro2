export function formatDueDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(date).replace('.', '');
}
