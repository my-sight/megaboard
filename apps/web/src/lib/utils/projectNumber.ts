const PROJECT_PATTERN = /^([A-Za-z]{1,2})-(\d{2})-(\d{3})(?:-(\d))?$/;

export function isValidProjectNumber(value: string) {
  return PROJECT_PATTERN.test(value.trim());
}

export function parseProjectNumber(value: string) {
  const match = value.trim().match(PROJECT_PATTERN);
  if (!match) {
    throw new Error("Ungültiges Projektnummernformat");
  }
  return {
    department: match[1],
    year: Number.parseInt(match[2]!, 10),
    sequence: Number.parseInt(match[3]!, 10),
    variant: match[4] ? Number.parseInt(match[4]!, 10) : undefined
  } as const;
}
