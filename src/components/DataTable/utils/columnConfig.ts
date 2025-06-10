import { Column } from '../types';

// Enhanced column interface with editable flag
interface EditableColumn extends Column {
  editable: boolean;
}

export const CORPUS_COLUMNS: EditableColumn[] = [
  {
    key: 'entryId',
    label: 'Entry ID',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'word',
    label: 'Word',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'lemma',
    label: 'Lemma',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'morph',
    label: 'Morphology',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'pos',
    label: 'POS',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'phrase',
    label: 'Phrase',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'grm',
    label: 'Grammar',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'ner',
    label: 'NER',
    sortable: false,
    filterable: true,
    editable: true,
  },
  {
    key: 'semantic',
    label: 'Semantic',
    sortable: false,
    filterable: true,
    editable: true,
  },
];

// Export the enhanced type for use in other components
export type { EditableColumn };
