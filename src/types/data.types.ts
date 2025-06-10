export interface LanguageFile {
  file: File;
  baseName: string;
  language: string;
}

export interface FileGroup {
  baseName: string;
  files: LanguageFile[];
}

export enum SaveButtonState {
  disabled = 'disabled',
  unsaved = 'unsaved',
  exported = 'exported',
}

export interface CorpusEntry {
  entryId: string;
  sentenceIndex: number;
  wordIndex: number;
  word: string;
  lemma: string;
  links: Set<number>;
  morph: string;
  pos: string;
  phrase: string;
  grm: string;
  ner: string;
  semantic: string;
  language: string;
}

export interface FileEntry {
  name: string;
  baseName: string;
  language: string;
  insertedAt: Date;
  updatedAt: Date;
}
