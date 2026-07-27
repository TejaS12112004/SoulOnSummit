export function formatAltitude(altitude?: number | null): string {
  if (altitude == null) {
    return 'TBD';
  }
  return new Intl.NumberFormat('en-US').format(altitude) + ' ft';
}
