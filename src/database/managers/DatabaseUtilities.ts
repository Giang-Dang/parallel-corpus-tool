import { db, type CorpusEntry, type File as DatabaseFile } from '../schema';
import { corpusEntryManager } from './CorpusEntryManager';
import { fileManager } from './FileManager';

export class DatabaseUtilities {
  /**
   * Clear entire database
   */
  async clearDatabase(): Promise<void> {
    await db.delete();
    await db.open();
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    corpusEntryCount: number;
    fileCount: number;
    languages: string[];
  }> {
    const [corpusEntryCount, fileCount] = await Promise.all([
      corpusEntryManager.getCorpusEntryCount(),
      fileManager.getFileCount(),
    ]);

    const languages = await db.corpus.orderBy('language').uniqueKeys();

    return {
      corpusEntryCount,
      fileCount,
      languages: languages as string[],
    };
  }

  /**
   * Transaction wrapper for bulk operations
   */
  async transaction<T>(tables: ('corpus' | 'files')[], operation: () => Promise<T>): Promise<T> {
    return await db.transaction(
      'rw',
      tables.map((table) => db[table]),
      operation,
    );
  }

  /**
   * Check database health
   */
  async checkDatabaseHealth(): Promise<{
    isHealthy: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    let isHealthy = true;

    try {
      // Test basic connectivity
      await db.corpus.count();
      await db.files.count();
    } catch {
      issues.push('Database connectivity issue');
      isHealthy = false;
    }

    return {
      isHealthy,
      issues,
    };
  }

  /**
   * Export database data
   */
  async exportData(): Promise<{
    corpus: CorpusEntry[];
    files: DatabaseFile[];
    exportedAt: Date;
  }> {
    const [corpus, files] = await Promise.all([
      corpusEntryManager.getAllCorpusEntries(),
      fileManager.getAllFiles(),
    ]);

    return {
      corpus,
      files,
      exportedAt: new Date(),
    };
  }
}

export const databaseUtilities = new DatabaseUtilities();
