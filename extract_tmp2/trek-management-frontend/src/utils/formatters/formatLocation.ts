export function formatLocation(location: string, state: string | null | undefined): string {
  if (!state) return location;
  if (!location) return state;
  return `${location}, ${state}`;
}
