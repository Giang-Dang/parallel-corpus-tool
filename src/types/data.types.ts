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
