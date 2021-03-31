import { Accessors, ImportFormat } from '../../graph';

export type TFileReaderResponse = {
  name: string;
  results: string | ArrayBuffer;
};

export type TFileContent = {
  fileName: string;
  content: ImportFormat['data'];
};

export type TFileContentState = {
  attachments: TFileContent[];
  dataType: ImportFormat['type'];
  accessors: Accessors;
  groupEdge: boolean;
};

export type JsonFileForms = {
  attachments: TFileContentState['attachments'];
};
