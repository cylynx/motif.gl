import React, { BaseSyntheticEvent, useRef, useState } from 'react';
import { Block } from 'baseui/block';
import { isEmpty, isEqual } from 'lodash';
import { OnChangeParams } from 'baseui/select';
import { useForm, UnpackNestedValue, SubmitHandler } from 'react-hook-form';
import { Button, KIND, SIZE } from 'baseui/button';

import { LabelMedium, ParagraphSmall } from 'baseui/typography';
import { useSelector } from 'react-redux';
import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import AccessorFields from './AccessorFields';

import useFileContents from '../hooks/useFileContents';
import useImportData from '../hooks/useImportData';

import * as Icon from '../../../../components/Icons';
import {
  ConfigureFieldsForm,
  TFileContent,
  SingleFileForms,
} from '../../../../redux/import/fileUpload';
import { JsonImport, TLoadFormat, GraphSlices } from '../../../../redux/graph';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { getGraph } from '../../../../redux/graph/selectors';

const ConfigureFields = () => {
  const {
    fileUpload: {
      accessors,
      groupEdge,
      isEdgeGroupable,
      dataType,
      attachments,
    },
    setAccessors,
  } = useFileContents();

  const { styleOptions } = useSelector((state) => getGraph(state));
  const { importJson, importEdgeList, importNodeEdge } = useImportData();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const jsonFileRef = useRef<TFileContent[]>(null);

  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<ConfigureFieldsForm>({
    defaultValues: {
      nodeID: accessors.nodeID,
      edgeID: accessors.edgeID,
      edgeSource: accessors.edgeSource,
      edgeTarget: accessors.edgeTarget,
      groupEdge,
    },
  });

  const isSubmitDisabled = isEmpty(errors) === false;

  const onSelectChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    onChange(selectedOption.id as string);

    const { groupEdge, ...accessors } = getValues();
    setAccessors(accessors);
  };

  const isContainStyle = (attachments: TFileContent[]) => {
    const isStyleOptionModified = !isEqual(
      GraphSlices.initialState.styleOptions,
      styleOptions,
    );

    const isAttachmentContainStyle: boolean = attachments
      .map((file: TFileContent) => file.content)
      .some((content: JsonImport) => {
        const { style } = content as TLoadFormat;
        const isContainStyle = !!style;
        return isContainStyle;
      });

    return isStyleOptionModified && isAttachmentContainStyle;
  };

  const importLocalFile: SubmitHandler<ConfigureFieldsForm> = (
    data: UnpackNestedValue<ConfigureFieldsForm>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();
    const { groupEdge, ...accessors } = data;

    if (dataType === 'json') {
      const isJsonContainStyle = isContainStyle(attachments as TFileContent[]);
      if (isJsonContainStyle) {
        jsonFileRef.current = attachments as TFileContent[];
        setModalOpen(true);
        return;
      }

      importJson(attachments as TFileContent[], groupEdge, accessors, true);
      return;
    }

    if (dataType === 'edgeListCsv') {
      importEdgeList(attachments as TFileContent[], groupEdge, accessors);
      return;
    }

    // nodeEdgeCsv
    importNodeEdge(attachments as SingleFileForms, groupEdge, accessors);
    return;
  };

  return (
    <Block marginTop='scale200'>
      <form onSubmit={handleSubmit(importLocalFile)}>
        <AccessorFields
          onSelectChange={onSelectChange}
          errors={errors}
          control={control}
          watch={watch}
          setError={setError}
          clearErrors={clearErrors}
          getValues={getValues}
          setValue={setValue}
        />
        <DataPreview isEdgeGroupable={isEdgeGroupable} dataType={dataType} />
        {isEdgeGroupable && <GroupEdgeConfiguration control={control} />}

        <Block position='absolute' bottom='0' right='0'>
          <Button
            type='submit'
            disabled={isSubmitDisabled}
            kind={KIND.primary}
            size={SIZE.compact}
            endEnhancer={<Icon.ChevronRight size={16} />}
          >
            Continue
          </Button>
        </Block>
      </form>

      <ConfirmationModal
        onClose={() => {
          importJson(jsonFileRef.current, groupEdge, accessors, false);
          jsonFileRef.current = null;
        }}
        isOpen={modalOpen}
        onReject={() => {
          importJson(jsonFileRef.current, groupEdge, accessors, false);
          jsonFileRef.current = null;
        }}
        onAccept={() => {
          importJson(jsonFileRef.current, groupEdge, accessors, true);
          jsonFileRef.current = null;
        }}
        rejectBtnText='No'
        confirmBtnText='Yes'
        header={
          <LabelMedium
            as='span'
            overrides={{
              Block: {
                style: {
                  textTransform: 'capitalize',
                },
              },
            }}
          >
            Overwrite existing styles?
          </LabelMedium>
        }
        body={
          <ParagraphSmall>
            Import file styles differ from currently applied styles.
          </ParagraphSmall>
        }
      />
    </Block>
  );
};

export default ConfigureFields;
