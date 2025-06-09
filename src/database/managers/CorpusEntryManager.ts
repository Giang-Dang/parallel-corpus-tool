import { db, type CorpusEntry } from '../schema';

export class CorpusEntryManager {
  /**
   * Create a new corpus entry
   */
  async createCorpusEntry(
    entry: Omit<CorpusEntry, 'id' | 'insertedAt' | 'updatedAt'>,
  ): Promise<number> {
    const now = new Date();
    const newEntry: Omit<CorpusEntry, 'id'> = {
      ...entry,
      insertedAt: now,
      updatedAt: now,
    };
    return (await db.corpus.add(newEntry)) as number;
  }

  /**
   * Create multiple corpus entries in bulk
   */
  async createCorpusEntries(
    entries: Omit<CorpusEntry, 'id' | 'insertedAt' | 'updatedAt'>[],
  ): Promise<number[]> {
    const now = new Date();
    const newEntries: Omit<CorpusEntry, 'id'>[] = entries.map((entry) => ({
      ...entry,
      insertedAt: now,
      updatedAt: now,
    }));
    return (await db.corpus.bulkAdd(newEntries, { allKeys: true })) as number[];
  }

  /**
   * Get corpus entry by ID
   */
  async getCorpusEntryById(id: number): Promise<CorpusEntry | undefined> {
    return await db.corpus.get(id);
  }

  /**
   * Get corpus entries with optional filtering and pagination
   * Note: For performance with millions of rows, always provide at least one filter or use pagination
   */
  async getAllCorpusEntries(params?: {
    language?: string;
    entryId?: string;
    sentenceIndex?: number;
    wordIndex?: number;
    links?: string;
    wordSearch?: string;
    lemmaSearch?: string;
    offset?: number;
    limit?: number;
  }): Promise<CorpusEntry[]> {
    // Default pagination to prevent loading millions of rows
    const defaultLimit = 1000;
    const limit = params?.limit ?? defaultLimit;
    const offset = params?.offset ?? 0;

    let query;

    // Use indexed queries for better performance
    if (params?.language) {
      query = db.corpus.where('language').equals(params.language);
    } else if (params?.entryId) {
      query = db.corpus.where('entryId').equals(params.entryId);
    } else if (params?.sentenceIndex !== undefined) {
      query = db.corpus.where('sentenceIndex').equals(params.sentenceIndex);
    } else if (params?.wordIndex !== undefined) {
      query = db.corpus.where('wordIndex').equals(params.wordIndex);
    } else if (params?.links) {
      query = db.corpus.where('links').equals(params.links);
    } else if (params?.wordSearch) {
      query = db.corpus.where('word').startsWithIgnoreCase(params.wordSearch);
    } else if (params?.lemmaSearch) {
      query = db.corpus.where('lemma').startsWithIgnoreCase(params.lemmaSearch);
    } else {
      // For unfiltered queries, use chunked pagination for safety
      query = db.corpus.orderBy('id');
    }

    // Apply pagination
    if (offset > 0) {
      query = query.offset(offset);
    }

    query = query.limit(limit);

    return await query.toArray();
  }

  /**
   * Update corpus entry
   */
  async updateCorpusEntry(
    id: number,
    updates: Partial<Omit<CorpusEntry, 'id' | 'insertedAt'>>,
  ): Promise<number> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    return await db.corpus.update(id, updateData);
  }

  /**
   * Delete corpus entries with flexible criteria
   */
  async deleteCorpusEntries(params?: {
    id?: number;
    language?: string;
    entryId?: string;
    sentenceIndex?: number;
    wordIndex?: number;
    deleteAll?: boolean;
  }): Promise<number> {
    if (params?.deleteAll) {
      await db.corpus.clear();
      return 0; // clear() doesn't return count, but operation succeeded
    }

    if (params?.id !== undefined) {
      await db.corpus.delete(params.id);
      return 1; // Single item deleted
    }

    if (params?.language) {
      return await db.corpus.where('language').equals(params.language).delete();
    }

    if (params?.entryId) {
      return await db.corpus.where('entryId').equals(params.entryId).delete();
    }

    if (params?.sentenceIndex !== undefined) {
      return await db.corpus.where('sentenceIndex').equals(params.sentenceIndex).delete();
    }

    if (params?.wordIndex !== undefined) {
      return await db.corpus.where('wordIndex').equals(params.wordIndex).delete();
    }

    // If no parameters provided, don't delete anything for safety
    return 0;
  }

  /**
   * Get corpus entry count
   */
  async getCorpusEntryCount(): Promise<number> {
    return await db.corpus.count();
  }

  /**
   * Get corpus entry count by language
   */
  async getCorpusEntryCountByLanguage(language: string): Promise<number> {
    return await db.corpus.where('language').equals(language).count();
  }

  /**
   * Get corpus entries by entry ID
   */
  async getCorpusEntriesByEntryId(entryId: string): Promise<CorpusEntry[]> {
    return await db.corpus.where('entryId').equals(entryId).toArray();
  }

  /**
   * Get corpus entries by sentence index
   */
  async getCorpusEntriesBySentenceIndex(sentenceIndex: number): Promise<CorpusEntry[]> {
    return await db.corpus.where('sentenceIndex').equals(sentenceIndex).toArray();
  }

  /**
   * Get corpus entries by word index
   */
  async getCorpusEntriesByWordIndex(wordIndex: number): Promise<CorpusEntry[]> {
    return await db.corpus.where('wordIndex').equals(wordIndex).toArray();
  }

  /**
   * Get corpus entries by sentence and word index (specific word in sentence)
   */
  async getCorpusEntryByPosition(
    sentenceIndex: number,
    wordIndex: number,
  ): Promise<CorpusEntry | undefined> {
    return await db.corpus
      .where('sentenceIndex')
      .equals(sentenceIndex)
      .and((entry) => entry.wordIndex === wordIndex)
      .first();
  }

  /**
   * Get all words in a specific sentence (ordered by word index)
   */
  async getWordsInSentence(sentenceIndex: number): Promise<CorpusEntry[]> {
    return await db.corpus.where('sentenceIndex').equals(sentenceIndex).sortBy('wordIndex');
  }

  /**
   * Get paginated corpus entries with efficient chunking
   * Optimized for large datasets
   */
  async getPaginatedEntries(
    page: number = 0,
    pageSize: number = 1000,
  ): Promise<{
    entries: CorpusEntry[];
    hasMore: boolean;
    totalCount?: number;
  }> {
    const offset = page * pageSize;

    // Get one extra item to check if there are more
    const entries = await db.corpus
      .orderBy('id')
      .offset(offset)
      .limit(pageSize + 1)
      .toArray();

    const hasMore = entries.length > pageSize;
    if (hasMore) {
      entries.pop(); // Remove the extra item
    }

    return {
      entries,
      hasMore,
    };
  }

  /**
   * Get entries count efficiently using Dexie's optimized count
   */
  async getFilteredCount(filter: {
    language?: string;
    entryId?: string;
    sentenceIndex?: number;
    wordIndex?: number;
    links?: string;
  }): Promise<number> {
    if (filter.language) {
      return await db.corpus.where('language').equals(filter.language).count();
    } else if (filter.entryId) {
      return await db.corpus.where('entryId').equals(filter.entryId).count();
    } else if (filter.sentenceIndex !== undefined) {
      return await db.corpus.where('sentenceIndex').equals(filter.sentenceIndex).count();
    } else if (filter.wordIndex !== undefined) {
      return await db.corpus.where('wordIndex').equals(filter.wordIndex).count();
    } else if (filter.links) {
      return await db.corpus.where('links').equals(filter.links).count();
    }

    // Fallback to total count (use with caution on large datasets)
    return await db.corpus.count();
  }

  /**
   * Stream corpus entries in chunks to avoid memory issues
   * Useful for processing large datasets
   */
  async *streamEntries(
    chunkSize: number = 1000,
    filter?: {
      language?: string;
      entryId?: string;
      sentenceIndex?: number;
      wordIndex?: number;
      links?: string;
    },
  ): AsyncGenerator<CorpusEntry[], void, unknown> {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      let query;

      if (filter?.language) {
        query = db.corpus.where('language').equals(filter.language);
      } else if (filter?.entryId) {
        query = db.corpus.where('entryId').equals(filter.entryId);
      } else if (filter?.sentenceIndex !== undefined) {
        query = db.corpus.where('sentenceIndex').equals(filter.sentenceIndex);
      } else if (filter?.wordIndex !== undefined) {
        query = db.corpus.where('wordIndex').equals(filter.wordIndex);
      } else if (filter?.links) {
        query = db.corpus.where('links').equals(filter.links);
      } else {
        query = db.corpus.orderBy('id');
      }

      const chunk = await query.offset(offset).limit(chunkSize).toArray();

      if (chunk.length === 0) {
        hasMore = false;
      } else {
        yield chunk;
        offset += chunkSize;
        hasMore = chunk.length === chunkSize;
      }
    }
  }
}

export const corpusEntryManager = new CorpusEntryManager();
