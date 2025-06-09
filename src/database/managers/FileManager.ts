import { db, type File } from '../schema';

export class FileManager {
  /**
   * Create a new file record
   */
  async createFile(file: Omit<File, 'id' | 'insertedAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const newFile: Omit<File, 'id'> = {
      ...file,
      insertedAt: now,
      updatedAt: now,
    };
    return (await db.files.add(newFile)) as number;
  }

  /**
   * Get file by ID
   */
  async getFileById(id: number): Promise<File | undefined> {
    return await db.files.get(id);
  }

  /**
   * Get file by name
   */
  async getFileByName(name: string): Promise<File | undefined> {
    return await db.files.where('name').equals(name).first();
  }

  /**
   * Get all files
   */
  async getAllFiles(): Promise<File[]> {
    return await db.files.toArray();
  }

  /**
   * Get files by language
   */
  async getFilesByLanguage(language: string): Promise<File[]> {
    return await db.files.where('language').equals(language).toArray();
  }

  /**
   * Update file
   */
  async updateFile(id: number, updates: Partial<Omit<File, 'id' | 'insertedAt'>>): Promise<number> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    return await db.files.update(id, updateData);
  }

  /**
   * Delete files with flexible criteria
   */
  async deleteFiles(params?: {
    id?: number;
    name?: string;
    language?: string;
    deleteAll?: boolean;
  }): Promise<number> {
    if (params?.deleteAll) {
      await db.files.clear();
      return 0; // clear() doesn't return count, but operation succeeded
    }

    if (params?.id !== undefined) {
      await db.files.delete(params.id);
      return 1; // Single item deleted
    }

    if (params?.name) {
      return await db.files.where('name').equals(params.name).delete();
    }

    if (params?.language) {
      return await db.files.where('language').equals(params.language).delete();
    }

    // If no parameters provided, don't delete anything for safety
    return 0;
  }

  /**
   * Get file count
   */
  async getFileCount(): Promise<number> {
    return await db.files.count();
  }
}

export const fileManager = new FileManager();
