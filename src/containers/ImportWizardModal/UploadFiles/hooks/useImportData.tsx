import { useDispatch } from 'react-redux';
import { GraphThunks, JsonImport } from '../../../../redux/graph';
import { TFileContent } from '../../../../redux/import/fileUpload';
import useFileContents from './useFileContents';

const useImportData = () => {
  const {
    fileUpload: { accessors, groupEdge, attachments },
  } = useFileContents();
  const dispatch = useDispatch();

  const importJson = () => {
    const attachmentContent: JsonImport[] = (attachments as TFileContent[]).map(
      (attachment: TFileContent) => attachment.content as JsonImport,
    );
    dispatch(
      GraphThunks.importJsonData(
        attachmentContent,
        groupEdge,
        accessors,
        false,
      ),
    );
  };

  return { importJson };
};

export default useImportData;
