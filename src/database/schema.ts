import Dexie, { type EntityTable } from 'dexie';

export interface CorpusEntry {
  id?: number; // Auto-increment primary key for IndexedDB
  entryId: string;
  sentenceIndex: number;
  wordIndex: number;
  word: string;
  lemma: string;
  links: string;
  morph: string;
  pos: string;
  phrase: string;
  grm: string;
  ner: string;
  semantic: string;
  language: string; // Language identifier
  insertedAt: Date;
  updatedAt: Date;
}

export interface File {
  id?: number;
  name: string;
  baseName: string;
  language: string;
  insertedAt: Date;
  updatedAt: Date;
}

export class CorpusDatabase extends Dexie {
  corpus: EntityTable<CorpusEntry, 'id'> = this.table('corpus');
  files: EntityTable<File, 'id'> = this.table('files');

  constructor() {
    super('corpus-db');
    this.version(1).stores({
      corpus:
        '++id, entryId, sentenceIndex, wordIndex, word, lemma, links, morph, pos, phrase, grm, ner, semantic, language, insertedAt, updatedAt',
      files: '++id, name, baseName, language, insertedAt, updatedAt',
    });
  }
}

export const db = new CorpusDatabase(); // Singleton instance
