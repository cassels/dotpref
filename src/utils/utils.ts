export const pad = (text: string, padding: string): string =>
  text.padEnd(32, padding).slice(0, 32);

export const normalizeId = (id: string) =>
  id
    .replace(/[^a-zA-Z0-9-_]+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/\.$|\.pref$/g, '');
