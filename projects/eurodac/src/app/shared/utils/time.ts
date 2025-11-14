export function nowMs(): number {
  return Date.now(); // ms desde 1970-01-01
}

export function toMs(date: Date | number): number {
  return date instanceof Date ? date.getTime() : date;
}
