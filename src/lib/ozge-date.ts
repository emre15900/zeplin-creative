const OZGE_DATE_STR = '2023-09-25'; // 25 Eylül 2023

/** "25 Eylül 2023" girilirse true döner (date picker: 2023-09-25 veya metin) */
export function isOzgeDate(input: string): boolean {
  const s = input.trim().toLowerCase();
  if (!s) return false;

  // Date picker YYYY-MM-DD formatı
  if (s === OZGE_DATE_STR) return true;

  // "25 eylül 2023" veya "25 Eylül 2023"
  if (s.includes('25') && s.includes('eylül') && s.includes('2023')) return true;

  // 25.09.2023, 25/09/2023, 25-09-2023, 25 09 2023
  const numeric = s.replace(/[.\/\-\s]/g, ' ');
  const parts = numeric.split(/\s+/).filter(Boolean);
  if (parts.length >= 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (d === 25 && m === 9 && y === 2023) return true;
  }

  // DD.MM.YYYY formatında tek parse
  const match = s.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})$/);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const y = parseInt(match[3], 10);
    if (d === 25 && m === 9 && y === 2023) return true;
  }

  return false;
}

export const OZGE_STORAGE_KEY = 'ozge_relationship_verified';
