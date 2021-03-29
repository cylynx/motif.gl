import { ImportFormat } from '../../../redux/graph';

export type TFileReaderResponse = {
  name: string;
  results: string | ArrayBuffer;
};

export type TFileContent = {
  fileName: string;
  content: ImportFormat;
};
