import { CorpusEntry } from '@/types/data.types';

interface CellChange {
  rowId: string;
  column: string;
  originalValue: string | number | Set<number>;
  newValue: string | number | Set<number>;
  timestamp: Date;
}

/**
 * Applies cell changes to corpus entries and returns updated entries
 */
export const applyChangesToEntries = (
  entries: CorpusEntry[],
  cellChanges: Map<string, CellChange>,
): CorpusEntry[] => {
  return entries.map((entry) => {
    const updatedEntry = { ...entry };

    // Apply all changes for this entry
    cellChanges.forEach((change) => {
      if (change.rowId === entry.entryId) {
        (updatedEntry as Record<string, unknown>)[change.column] = change.newValue;
      }
    });

    return updatedEntry;
  });
};

/**
 * Formats a corpus entry value for TXT output
 */
const formatTxtValue = (value: string | number | Set<number>): string => {
  if (value instanceof Set) {
    return Array.from(value)
      .sort((a, b) => a - b)
      .join(',');
  }
  return String(value || '');
};

/**
 * Generates TXT content from corpus entries for a specific language
 */
export const generateTxtContent = (entries: CorpusEntry[], language: string): string => {
  const languageEntries = entries.filter((entry) => entry.language === language);

  return languageEntries
    .map((entry) =>
      [
        entry.entryId,
        entry.word,
        entry.lemma,
        formatTxtValue(entry.links),
        entry.morph,
        entry.pos,
        entry.phrase,
        entry.grm,
        entry.ner,
        entry.semantic,
      ].join('\t'),
    )
    .join('\n');
};

/**
 * Downloads content as a file
 */
export const downloadFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Generates filename with timestamp for downloaded corpus file
 */
export const generateFilename = (baseName: string, language: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${baseName}_${timestamp}_${language}.txt`;
};
