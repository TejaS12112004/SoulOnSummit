export function formatDuration(days?: number | null): string {
  if (days == null) {
    return 'TBD';
  }
  return `${days} Day${days > 1 ? 's' : ''}`;
}
