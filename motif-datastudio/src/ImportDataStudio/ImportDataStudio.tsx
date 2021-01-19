import React from 'react';
import { useDispatch } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { GraphData } from '../../../src/containers/Graph';
import { OPTIONS as IMPORT_OPTIONS } from '../../../src/processors/import-data';

import * as Graph from '../../../src/containers/Graph/types';
import { importSingleJsonData } from '../../../src/redux/add-data-thunk';

import { closeModal } from '../../../src/redux';

import { DataStudioMessage } from './DataStudioMessage';

type FormValues = {
  dataType: { label: string; id: string }[];
  nodeID?: string;
  edgeID?: string;
  edgeSource: string;
  edgeTarget: string;
};

const importOptions = Object.values(IMPORT_OPTIONS);

const ImportDataStudio = ({ data }: { data: DataStudioMessage }) => {
  const dispatch = useDispatch();

  const { handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dataType: [importOptions[0]],
      edgeSource: 'source',
      edgeTarget: 'target',
    },
  });

  const isButtonDisabled = data.tables.DEFAULT === null;

  const uniqueNodes: string[] = Array.from(
    new Set([].concat(...data.tables.DEFAULT.map((e) => e.dimensions))),
  );

  const dataStudioData: GraphData = {
    nodes: uniqueNodes.map((n) => {
      return { id: n, label: n };
    }),
    edges: data.tables.DEFAULT.map((e) => {
      return {
        id: e.dimensions[0] + '-' + e.dimensions[1],
        from: e.dimensions[0],
        to: e.dimensions[1],
        weight: e.metric[0],
      };
    }),
    metadata: {
      // key?: number | string;
      // fields?: GraphFields;
      // search_size?: number;
      // retrieved_size?: number;
      title: 'DataStudio Import',
      // visible?: boolean;
    },
    // key?: number | string;
  };

  const onSubmitForm: SubmitHandler<FormValues> = (data, e) => {
    e.preventDefault();
    const { dataType, ...accessors } = data;

    // remove accessor keys with empty string
    Object.keys(accessors as Graph.Accessors)
      .filter((k) => accessors[k] === '')
      .map((k) => delete accessors[k]);

    dispatch(
      importSingleJsonData({ data: dataStudioData, type: 'json' }, accessors),
    );

    dispatch(closeModal());
  };

  return (
    <form>
      <Block marginTop='10px' display='flex' justifyContent='flex-end'>
        <div style={{ height: '200px', width: '800px', overflow: 'scroll' }}>
          <table
            style={{ border: '1px solid black', borderCollapse: 'collapse' }}
          >
            <thead></thead>
            <tbody>
              {data.tables.DEFAULT &&
                data.tables.DEFAULT.map((row) => (
                  <tr>
                    {row.dimensions.concat(row.metric).map((d) => (
                      <td style={{ border: '1px solid black', padding: '5px' }}>
                        {d}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Block>
      <Block>
        <Button
          type='submit'
          disabled={isButtonDisabled}
          onClick={handleSubmit(onSubmitForm)}
        >
          Import Data
        </Button>
      </Block>
    </form>
  );
};

export default ImportDataStudio;
