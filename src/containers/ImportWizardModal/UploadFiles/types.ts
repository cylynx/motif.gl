import { Accessors, ImportFormat } from '../../../redux/graph';

export type TFileReaderResponse = {
  name: string;
  results: string | ArrayBuffer;
};

export type TFileContent = {
  fileName: string;
  content: ImportFormat;
};

export type TFileContentState = {
  attachments: TFileContent[];
  dataType: ImportFormat['type'];
  accessors: Accessors;
  groupEdge: boolean;
};

export type TFileContentAction = {
  type: string;
  payload?:
    | TFileContentState['attachments']
    | TFileContentState['dataType']
    | TFileContentState['accessors']
    | TFileContentState['groupEdge'];
};

export type JsonFileForms = {
  attachments: TFileContentState['attachments'];
};
