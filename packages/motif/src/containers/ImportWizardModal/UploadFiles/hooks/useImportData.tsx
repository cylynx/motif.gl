import {
  GraphThunks,
  JsonImport,
  EdgeListCsv,
  Accessors,
} from '../../../../redux/graph';
import {
  TFileContent,
  SingleFileForms,
} from '../../../../redux/import/fileUpload';
import { useDispatch } from '../../../../redux/hooks';

const useImportData = () => {
  const dispatch = useDispatch();

  const importJson = (
    attachments: TFileContent[],
    groupEdge: boolean,
    accessors: Accessors,
    overwriteStyles = false,
  ) => {
    const jsons: JsonImport[] = (attachments as TFileContent[]).map(
      (attachment: TFileContent) => attachment.content as JsonImport,
    );
    dispatch(
      GraphThunks.importJsonData(jsons, groupEdge, accessors, overwriteStyles),
    );
  };

  const importEdgeList = (
    attachments: TFileContent[],
    groupEdge: boolean,
    accessors: Accessors,
  ) => {
    const edgeList: EdgeListCsv[] = (attachments as TFileContent[]).map(
      (attachment: TFileContent) => attachment.content as EdgeListCsv,
    );
    dispatch(GraphThunks.importEdgeListData(edgeList, groupEdge, accessors));
  };

  const importNodeEdge = (
    attachments: SingleFileForms,
    groupEdge: boolean,
    accessors: Accessors,
  ) => {
    dispatch(GraphThunks.importNodeEdgeData(attachments, groupEdge, accessors));
  };

  return { importJson, importEdgeList, importNodeEdge };
};

export default useImportData;
