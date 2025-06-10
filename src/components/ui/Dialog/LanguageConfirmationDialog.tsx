import { LanguageCode } from '@/constants/languages';
import { FileGroup } from '@/types/data.types';
import { getLanguageName } from '@/utils/languageHelper';
import useFileLoaderAction from '../../features/corpus/FileLoader/hooks/useFileLoaderAction';

export default function MultipleFilesConfirmationDialog({
  selectedFileGroup,
  onConfirm,
}: {
  selectedFileGroup: FileGroup;
  onConfirm: (files: File[]) => Promise<void>;
}) {
  const { setShowLanguageConfirmation } = useFileLoaderAction();

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-3 text-lg font-medium text-blue-900">Multiple Language Files Detected</h3>
      <p className="mb-3 text-blue-800">
        Found {selectedFileGroup.files.length} language files for &quot;
        {selectedFileGroup.baseName}&quot;:
      </p>
      <ul className="mb-4 space-y-1 text-sm text-blue-700">
        {selectedFileGroup.files.map((langFile, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-400"></span>
            {langFile.file.name} ({getLanguageName(langFile.language as LanguageCode)})
          </li>
        ))}
      </ul>
      <p className="mb-4 text-sm text-blue-800">
        Do you want to load all language files for bilingual analysis?
      </p>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setShowLanguageConfirmation(false)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={async () => {
            await onConfirm(selectedFileGroup.files.map((file) => file.file));
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
        >
          Load All Languages
        </button>
      </div>
    </div>
  );
}
