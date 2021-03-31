import { Accessors, ImportFormat, NodeEdgeDataType } from '../../graph';

export type TFileReaderResponse = {
  name: string;
  results: string | ArrayBuffer;
};

export type TFileContent = {
  fileName: string;
  content: ImportFormat['data'];
};

export type TFileContentState = {
  attachments: TFileContent[] | SingleFileForms;
  dataType: ImportFormat['type'];
  accessors: Accessors;
  groupEdge: boolean;
};

export type MultipleFileForms = {
  attachments: TFileContentState['attachments'];
};

export type SingleFileForms = {
  nodeCsv: TFileContent[];
  edgeCsv: TFileContent[];
};
