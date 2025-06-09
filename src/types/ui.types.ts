export enum ActivePopup {
  FileLoader = 'FileLoader',
}

export enum SaveButtonState {
  disabled = 'disabled',
  unsaved = 'unsaved',
  exported = 'exported',
}

export interface TabConfig {
  id: string;
  label: string;
}
