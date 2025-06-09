import { FileGroup, LanguageFile } from '@/types/data.types';
import { normalizeToLanguageCode } from './languageHelper';

export const parseLanguageFile = (file: File): LanguageFile | null => {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  const match = nameWithoutExt.match(/^(.+)_([a-z]{2,3})$/i);

  if (match) {
    const baseName = match[1];
    const suffix = match[2];

    // Convert country code to language code if needed
    const languageCode = normalizeToLanguageCode(suffix);

    if (languageCode) {
      return {
        file,
        baseName,
        language: languageCode,
      };
    }
  }
  return null;
};

export const parseLanguageFiles = (files: File[]): (LanguageFile | null)[] => {
  return files.map((file) => parseLanguageFile(file));
};

export const createFileGroup = (files: File[]): FileGroup => {
  const parsedFiles = files
    .map(parseLanguageFile)
    .filter((file): file is LanguageFile => file !== null);

  if (parsedFiles.length === 0) {
    return { baseName: '', files: [] };
  }

  const baseName = parsedFiles[0].baseName;

  return {
    baseName,
    files: parsedFiles,
  };
};
