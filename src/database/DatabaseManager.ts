import { corpusEntryManager, CorpusEntryManager } from './managers/CorpusEntryManager';
import { fileManager, FileManager } from './managers/FileManager';
import { databaseUtilities, DatabaseUtilities } from './managers/DatabaseUtilities';

export class DatabaseManager {
  // Expose individual managers as properties
  public corpus: CorpusEntryManager;
  public files: FileManager;
  public utilities: DatabaseUtilities;

  constructor() {
    this.corpus = corpusEntryManager;
    this.files = fileManager;
    this.utilities = databaseUtilities;
  }

  // ========== CONVENIENCE METHODS ==========
  // Provide direct access to commonly used methods for backward compatibility

  // Corpus operations
  async createCorpusEntry(...args: Parameters<CorpusEntryManager['createCorpusEntry']>) {
    return this.corpus.createCorpusEntry(...args);
  }

  async createCorpusEntries(...args: Parameters<CorpusEntryManager['createCorpusEntries']>) {
    return this.corpus.createCorpusEntries(...args);
  }

  async getAllCorpusEntries(...args: Parameters<CorpusEntryManager['getAllCorpusEntries']>) {
    return this.corpus.getAllCorpusEntries(...args);
  }

  async getCorpusEntryById(...args: Parameters<CorpusEntryManager['getCorpusEntryById']>) {
    return this.corpus.getCorpusEntryById(...args);
  }

  async updateCorpusEntry(...args: Parameters<CorpusEntryManager['updateCorpusEntry']>) {
    return this.corpus.updateCorpusEntry(...args);
  }

  async deleteCorpusEntries(...args: Parameters<CorpusEntryManager['deleteCorpusEntries']>) {
    return this.corpus.deleteCorpusEntries(...args);
  }

  async getCorpusEntryCount(...args: Parameters<CorpusEntryManager['getCorpusEntryCount']>) {
    return this.corpus.getCorpusEntryCount(...args);
  }

  async getCorpusEntryCountByLanguage(
    ...args: Parameters<CorpusEntryManager['getCorpusEntryCountByLanguage']>
  ) {
    return this.corpus.getCorpusEntryCountByLanguage(...args);
  }

  async getCorpusEntriesByEntryId(
    ...args: Parameters<CorpusEntryManager['getCorpusEntriesByEntryId']>
  ) {
    return this.corpus.getCorpusEntriesByEntryId(...args);
  }

  async getCorpusEntriesBySentenceIndex(
    ...args: Parameters<CorpusEntryManager['getCorpusEntriesBySentenceIndex']>
  ) {
    return this.corpus.getCorpusEntriesBySentenceIndex(...args);
  }

  async getCorpusEntriesByWordIndex(
    ...args: Parameters<CorpusEntryManager['getCorpusEntriesByWordIndex']>
  ) {
    return this.corpus.getCorpusEntriesByWordIndex(...args);
  }

  async getCorpusEntryByPosition(
    ...args: Parameters<CorpusEntryManager['getCorpusEntryByPosition']>
  ) {
    return this.corpus.getCorpusEntryByPosition(...args);
  }

  async getWordsInSentence(...args: Parameters<CorpusEntryManager['getWordsInSentence']>) {
    return this.corpus.getWordsInSentence(...args);
  }

  async getPaginatedEntries(...args: Parameters<CorpusEntryManager['getPaginatedEntries']>) {
    return this.corpus.getPaginatedEntries(...args);
  }

  async getFilteredCount(...args: Parameters<CorpusEntryManager['getFilteredCount']>) {
    return this.corpus.getFilteredCount(...args);
  }

  async streamEntries(...args: Parameters<CorpusEntryManager['streamEntries']>) {
    return this.corpus.streamEntries(...args);
  }

  // File operations
  async createFile(...args: Parameters<FileManager['createFile']>) {
    return this.files.createFile(...args);
  }

  async getFileById(...args: Parameters<FileManager['getFileById']>) {
    return this.files.getFileById(...args);
  }

  async getFileByName(...args: Parameters<FileManager['getFileByName']>) {
    return this.files.getFileByName(...args);
  }

  async getAllFiles(...args: Parameters<FileManager['getAllFiles']>) {
    return this.files.getAllFiles(...args);
  }

  async getFilesByLanguage(...args: Parameters<FileManager['getFilesByLanguage']>) {
    return this.files.getFilesByLanguage(...args);
  }

  async updateFile(...args: Parameters<FileManager['updateFile']>) {
    return this.files.updateFile(...args);
  }

  async deleteFiles(...args: Parameters<FileManager['deleteFiles']>) {
    return this.files.deleteFiles(...args);
  }

  async getFileCount(...args: Parameters<FileManager['getFileCount']>) {
    return this.files.getFileCount(...args);
  }

  // Utility operations
  async clearDatabase(...args: Parameters<DatabaseUtilities['clearDatabase']>) {
    return this.utilities.clearDatabase(...args);
  }

  async getDatabaseStats(...args: Parameters<DatabaseUtilities['getDatabaseStats']>) {
    return this.utilities.getDatabaseStats(...args);
  }

  async transaction(...args: Parameters<DatabaseUtilities['transaction']>) {
    return this.utilities.transaction(...args);
  }

  async checkDatabaseHealth(...args: Parameters<DatabaseUtilities['checkDatabaseHealth']>) {
    return this.utilities.checkDatabaseHealth(...args);
  }

  async exportData(...args: Parameters<DatabaseUtilities['exportData']>) {
    return this.utilities.exportData(...args);
  }
}

// Export singleton instance
export const databaseManager = new DatabaseManager();

// Re-export individual managers for direct access
export { corpusEntryManager, fileManager, databaseUtilities };

// Re-export types
export type { CorpusEntry, File } from './schema';
