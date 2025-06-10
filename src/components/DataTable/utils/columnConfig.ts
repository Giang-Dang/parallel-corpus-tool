import { Column } from '../types';

export const CORPUS_COLUMNS: Column[] = [
  {
    key: 'entryId',
    label: 'Entry ID',
    sortable: false,
    filterable: true,
  },
  {
    key: 'word',
    label: 'Word',
    sortable: false,
    filterable: true,
  },
  {
    key: 'lemma',
    label: 'Lemma',
    sortable: false,
    filterable: true,
  },
  {
    key: 'morph',
    label: 'Morphology',
    sortable: false,
    filterable: true,
  },
  {
    key: 'pos',
    label: 'POS',
    sortable: false,
    filterable: true,
  },
  {
    key: 'phrase',
    label: 'Phrase',
    sortable: false,
    filterable: true,
  },
  {
    key: 'grm',
    label: 'Grammar',
    sortable: false,
    filterable: true,
  },
  {
    key: 'ner',
    label: 'NER',
    sortable: false,
    filterable: true,
  },
  {
    key: 'semantic',
    label: 'Semantic',
    sortable: false,
    filterable: true,
  },
];
