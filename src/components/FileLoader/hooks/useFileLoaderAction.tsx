import { useAppContext } from '@/contexts/AppContext';
import { useDatabaseInMemoryContext } from '@/contexts/DatabaseInMemoryContext';
import { usePopupContext } from '@/contexts/PopupContext';
import { CorpusEntry, FileEntry } from '@/types/data.types';
import { createFileGroup, parseLanguageFiles } from '@/utils/fileUtils';
import { useCallback, useRef, useState } from 'react';

export default function useFileLoaderAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLanguageConfirmation, setShowLanguageConfirmation] = useState(false);
  const [progressedLines, setProgressedLines] = useState(0);
  const [totalLines, setTotalLines] = useState(0);

  const { setIsOpenPopup, closePopup } = usePopupContext();
  const { setSelectedFileGroup } = useAppContext();
  const { setCorpusEntries, setFileEntries, setCorpusIdsByLanguage } = useDatabaseInMemoryContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClose = useCallback(() => {
    setIsOpenPopup(false);
  }, [setIsOpenPopup]);

  const processFileInChunks = useCallback(
    async (file: File): Promise<void> => {
      const BATCH_SIZE = 100000; // Larger batches for better performance
      const TOTAL_COLUMNS = 10;

      // Read file as stream for better memory efficiency
      const corpusEntries: CorpusEntry[] = [];
      const text = await file.text();
      const lines = text.split('\n'); // Remove trim() and use split directly
      const totalLines = lines.length;
      const rowIdSet = new Set<string>();
      const duplicateRowIdSet = new Set<string>();

      // Pre-compute static values
      const language = file.name.split('.')[0].split('_')[1];

      setTotalLines(totalLines);

      let currentBatch: CorpusEntry[] = [];
      let processedLines = 0;

      for (let i = 0; i < totalLines; i++) {
        const line = lines[i];
        if (!line || line.length < 10) continue;

        // Optimized tab-split with limit
        const columns = line.split('\t', TOTAL_COLUMNS);
        if (columns.length < TOTAL_COLUMNS) continue;

        const entryId = columns[0];
        const entry: CorpusEntry = {
          language,
          entryId,
          sentenceIndex: parseInt(entryId.slice(2, -2), 10), // Explicit radix for speed
          wordIndex: parseInt(entryId.slice(-2), 10),
          word: columns[1],
          lemma: columns[2],
          links: new Set(columns[3].split(',').map(Number)),
          morph: columns[4],
          pos: columns[5],
          phrase: columns[6],
          grm: columns[7],
          ner: columns[8],
          semantic: columns[9],
        };

        if (rowIdSet.has(entryId)) {
          duplicateRowIdSet.add(entryId);
        }

        rowIdSet.add(entryId);
        currentBatch.push(entry);
        processedLines++;

        // Batch insert when batch is full
        if (currentBatch.length >= BATCH_SIZE) {
          corpusEntries.push(...currentBatch);
          setProgressedLines(processedLines);
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          currentBatch = [];
        }
      }

      if (duplicateRowIdSet.size > 0) {
        setError(`Duplicate entry IDs found: ${Array.from(duplicateRowIdSet).join(', ')}`);
        return;
      }

      // Insert remaining entries
      if (currentBatch.length > 0) {
        corpusEntries.push(...currentBatch);
      }

      setCorpusEntries((prev) => [...prev, ...corpusEntries]);
      setCorpusIdsByLanguage((prev) => {
        const newMap = new Map(prev);
        newMap.set(language, rowIdSet);
        return newMap;
      });
      setProgressedLines(processedLines);
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    },
    [setCorpusEntries, setCorpusIdsByLanguage],
  );

  const processFiles = useCallback(
    async (files: File[]): Promise<void> => {
      try {
        setShowLanguageConfirmation(false);
        setIsLoading(true);
        setError(null);

        setFileEntries([]);

        for (const file of files) {
          await processFileInChunks(file);
          const date = new Date();
          setFileEntries((prev: FileEntry[]) => [
            ...prev,
            {
              name: file.name,
              baseName: file.name.split('.')[0].split('_')[0],
              language: file.name.split('.')[0].split('_')[1],
              insertedAt: date,
              updatedAt: date,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
        closePopup();
      }
    },
    [closePopup, processFileInChunks, setFileEntries],
  );

  const handleFileDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setError(null);
      setShowLanguageConfirmation(false);

      const files = Array.from(event.dataTransfer.files);

      console.log('files', files);

      const textFiles = files.filter(
        (file) => file.type === 'text/plain' || file.name.endsWith('.txt'),
      );

      if (textFiles.length === 0) {
        setError('Please drop valid text files (.txt)');
        return;
      }

      // Single file - process directly
      if (textFiles.length === 1) {
        setCorpusEntries([]);
        setCorpusIdsByLanguage(new Map());
        const groups = createFileGroup(textFiles);
        setSelectedFileGroup(groups);
        processFiles(textFiles);
        return;
      }

      // Multiple files - validate language patterns
      const languageFiles = parseLanguageFiles(textFiles);
      const hasInvalidFiles = languageFiles?.[0]?.baseName !== languageFiles?.[1]?.baseName;

      if (hasInvalidFiles) {
        setError(
          `Invalid file naming: ${languageFiles?.[0]?.file.name} does not match pattern from file ${languageFiles?.[1]?.file.name}. Use pattern: name_language.txt (e.g., corpus_en.txt, corpus_vn.txt)`,
        );
        return;
      }

      const groups = createFileGroup(textFiles);
      setSelectedFileGroup(groups);
      // All files valid - group and process
      setShowLanguageConfirmation(true);
    },
    [setSelectedFileGroup, processFiles, setCorpusEntries, setCorpusIdsByLanguage],
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Reset input for re-selection
    event.target.value = '';

    // Early validation
    if (files.length === 0) return;
    if (files.length > 2) {
      setError('Please select a maximum of 2 files');
      return;
    }

    setError(null);
    setShowLanguageConfirmation(false);

    // Filter valid text files
    const textFiles = files.filter(
      (file) => file.type === 'text/plain' || file.name.endsWith('.txt'),
    );

    if (textFiles.length === 0) {
      setError('Please select valid text files (.txt)');
      return;
    }

    // Single file - process directly
    if (textFiles.length === 1) {
      setCorpusEntries([]);
      setCorpusIdsByLanguage(new Map());
      const groups = createFileGroup(textFiles);
      setSelectedFileGroup(groups);
      processFiles(textFiles);
      return;
    }

    // Multiple files - validate language patterns
    const languageFiles = parseLanguageFiles(textFiles);
    const hasInvalidFiles = languageFiles?.[0]?.baseName !== languageFiles?.[1]?.baseName;

    if (hasInvalidFiles) {
      setError(
        `Invalid file naming: ${languageFiles?.[0]?.file.name} does not match pattern from file ${languageFiles?.[1]?.file.name}. Use pattern: name_language.txt (e.g., corpus_en.txt, corpus_vn.txt)`,
      );
      return;
    }

    // All files valid - show confirmation
    const groups = createFileGroup(textFiles);
    setSelectedFileGroup(groups);
    setShowLanguageConfirmation(true);
  };

  return {
    isLoading,
    error,
    onClose,
    showLanguageConfirmation,
    setShowLanguageConfirmation,
    setError,
    setIsLoading,
    processFiles,
    progressedLines,
    totalLines,
    handleFileDrop,
    handleBrowseClick,
    fileInputRef,
    handleFileSelect,
  };
}
