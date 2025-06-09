import { useAppContext } from '@/contexts/AppContext';
import { usePopupContext } from '@/contexts/PopupContext';
import { CorpusEntry, db } from '@/database/schema';
import { createFileGroup, parseLanguageFiles } from '@/utils/fileUtils';
import { useCallback, useRef, useState } from 'react';

export default function useFileLoaderAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLanguageConfirmation, setShowLanguageConfirmation] = useState(false);
  const [progressedLines, setProgressedLines] = useState(0);
  const [totalLines, setTotalLines] = useState(0);

  const { setIsOpen, closePopup } = usePopupContext();
  const { setSelectedFileGroup } = useAppContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const processFileInChunks = async (file: File): Promise<void> => {
    const CHUNK_SIZE = 10000;
    const TOTAL_COLUMNS = 10;
    const PROGRESS_UPDATE_INTERVAL = 20;

    const text = await file.text();
    const lines = text.trim().split('\n');

    const CHUNK_COUNT = Math.ceil(lines.length / CHUNK_SIZE);

    let currentLine = 0;
    let currentChunk: CorpusEntry[] = [];
    let lastProgressUpdate = performance.now();

    setTotalLines(lines.length);

    for (let chunkIndex = 0; chunkIndex < CHUNK_COUNT; chunkIndex++) {
      for (let i = 0; i < CHUNK_SIZE && currentLine < lines.length; i++) {
        currentLine++;
        const line = lines[currentLine].trim();
        if (!line) continue;

        const columns = line.split('\t');
        if (columns.length < TOTAL_COLUMNS) continue;

        const entry: CorpusEntry = {
          language: file.name.split('.')[0].split('_')[1], // Extract language from filename
          entryId: columns[0],
          sentenceIndex: parseInt(columns[0].slice(2, -2)),
          wordIndex: parseInt(columns[0].slice(-2)),
          word: columns[1],
          insertedAt: new Date(),
          updatedAt: new Date(),
          lemma: columns[2],
          links: columns[3],
          morph: columns[4],
          pos: columns[5],
          phrase: columns[6],
          grm: columns[7],
          ner: columns[8],
          semantic: columns[9],
        };

        currentChunk.push(entry);

        await db.corpus.bulkAdd(currentChunk);
        currentChunk = [];

        // Update UI
        const now = performance.now();
        if (now - lastProgressUpdate >= PROGRESS_UPDATE_INTERVAL) {
          setProgressedLines(i);
          lastProgressUpdate = now;
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      }
    }
  };

  const processFiles = useCallback(async (files: File[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      for (const file of files) {
        await processFileInChunks(file);
        await db.files.add({
          name: file.name,
          baseName: file.name.split('.')[0],
          language: file.name.split('.')[0],
          insertedAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setError(null);
      setShowLanguageConfirmation(false);

      const files = Array.from(event.dataTransfer.files);

      const textFiles = files.filter(
        (file) => file.type === 'text/plain' || file.name.endsWith('.txt'),
      );

      if (textFiles.length === 0) {
        setError('Please drop valid text files (.txt)');
        return;
      }

      // Single file - process directly
      if (textFiles.length === 1) {
        const groups = createFileGroup(textFiles);
        setSelectedFileGroup(groups);
        processFileInChunks(textFiles[0]);
        closePopup();
        return;
      }

      // Multiple files - validate language patterns
      const languageFiles = parseLanguageFiles(textFiles);
      const invalidFiles = textFiles.filter((_, index) => languageFiles[index] === null);

      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles.map((f) => f.name).join(', ');
        setError(
          `Invalid file naming: ${invalidFileNames}. Use pattern: name_language.txt (e.g., corpus_en.txt, corpus_vn.txt)`,
        );
        return;
      }

      // All files valid - group and process
      setShowLanguageConfirmation(true);
      closePopup();
    },
    [setSelectedFileGroup, closePopup],
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
      const groups = createFileGroup(textFiles);
      setSelectedFileGroup(groups);
      processFileInChunks(textFiles[0]);
      return;
    }

    // Multiple files - validate language patterns
    const languageFiles = parseLanguageFiles(textFiles);
    const invalidFiles = textFiles.filter((_, index) => languageFiles[index] === null);

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((f) => f.name).join(', ');
      setError(
        `Invalid file naming: ${invalidFileNames}. Use pattern: name_language.txt (e.g., corpus_en.txt, corpus_vn.txt)`,
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
