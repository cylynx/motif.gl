import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import ErrorMessage from '../../../components/ImportErrorMessage';

export const BoldCodeText = ({ children }) => {
  return (
    <b>
      <code>{children}</code>
    </b>
  );
};

export const EmptyData = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The datasets provided are empty.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif is unable to import the dataset because the provided JSON is
          empty.
        </Block>
      }
    />
  );
};

export const MissingNodeOrEdge = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Motif JSON Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Uploaded dataset(s) does not contain{' '}
          <BoldCodeText>nodes</BoldCodeText> or{' '}
          <BoldCodeText>edges</BoldCodeText>.
        </Block>
      }
    />
  );
};

export const InvalidJsonFormat = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid JSON Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif is unable to parse the dataset because the JSON format is
          invalid.
        </Block>
      }
    />
  );
};

export const EdgeSourceValueUndefined = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Missing value in edge source column.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif is unable to establish the relationship between nodes with the
            specified <b>edge source</b> because the selected attribute might be
            missing, <code>undefined</code> or <code>null</code>.
          </Block>

          <Block marginTop='scale300'>
            Please fix the missing attribute or select an appropriate{' '}
            <b>Source</b> in the above dropdown to try again.
          </Block>
        </Block>
      }
    />
  );
};

export const EdgeTargetValueUndefined = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Missing value in edge target column.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif is unable to establish the relationship between nodes with the
            specified <b>edge target</b> because the selected attribute might be
            missing, <code>undefined</code> or <code>null</code>.
          </Block>

          <Block marginTop='scale300'>
            Please fix the missing attribute or select an appropriate{' '}
            <b>Target</b> in the above dropdown to try again.
          </Block>
        </Block>
      }
    />
  );
};

type ConflictNodeEdgeIDProps = { conflictIds: string[] };
export const ConflictNodeEdgeID = ({
  conflictIds,
}: ConflictNodeEdgeIDProps) => {
  const [, theme] = useStyletron();
  const conflictIdList = useMemo(
    () => conflictIds.join(', '),
    [conflictIds.length],
  );
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Node and Edge ID conflicts.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif is unable to parse one of the graph because it contains
            duplicate id between <BoldCodeText>nodes</BoldCodeText> and{' '}
            <BoldCodeText>edges</BoldCodeText>. <br />
            <Block marginTop='scale0'>
              The follow approach may help you to solve this error:
              <ol style={{ margin: '4px 0' }}>
                <li>
                  Remove the duplicate id from the dataset and re-import the
                  data again.
                </li>
                <li>
                  Select a unique <BoldCodeText>Node ID</BoldCodeText> and{' '}
                  <BoldCodeText>Edge ID</BoldCodeText> in the above dropdown.
                </li>
              </ol>
            </Block>
          </Block>

          <div
            style={{
              width: '100%',
              padding: '4px 0',
              borderBottom: `1px solid ${theme.colors.contentTertiary}`,
            }}
          />

          <Block marginTop='scale300' color='contentSecondary'>
            Duplicate ID found:{' '}
            <b style={{ marginLeft: '4px' }}>{conflictIdList}</b>
          </Block>
        </Block>
      }
    />
  );
};

type ConflictNodeIDProps = ConflictNodeEdgeIDProps;
export const DuplicateNodeID = ({ conflictIds }: ConflictNodeIDProps) => {
  const [, theme] = useStyletron();

  const conflictIdList = useMemo(
    () => conflictIds.join(', '),
    [conflictIds.length],
  );

  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Node ID Conflicts.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif is unable to parse one of the graph because it contains
            duplicate id(s) in <BoldCodeText>nodes</BoldCodeText>.<br />
            <Block marginTop='scale0'>
              The follow approach may help you to solve this error:
              <ol style={{ margin: '4px 0' }}>
                <li>
                  Remove the duplicate id from the dataset and perform data
                  importation again.
                </li>
                <li>
                  Select unique <BoldCodeText>NodeID</BoldCodeText> field in the
                  dropdown above.
                </li>
              </ol>
            </Block>
          </Block>

          <div
            style={{
              width: '100%',
              padding: '4px 0',
              borderBottom: `1px solid ${theme.colors.contentTertiary}`,
            }}
          />

          <Block marginTop='scale300' color='contentSecondary'>
            Duplicate ID found:{' '}
            <b style={{ marginLeft: '4px' }}>{conflictIdList}</b>
          </Block>
        </Block>
      }
    />
  );
};

type ConflictEdgeIDProps = ConflictNodeIDProps;
export const DuplicateEdgeID = ({ conflictIds }: ConflictEdgeIDProps) => {
  const [, theme] = useStyletron();

  const conflictIdList = useMemo(
    () => conflictIds.join(', '),
    [conflictIds.length],
  );

  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Edge ID Conflicts.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif is unable to parse one of the graph because it contains
            duplicate id(s) in <BoldCodeText>edges</BoldCodeText>.<br />
            <Block marginTop='scale0'>
              The follow approach may help you to solve this error:
              <ol style={{ margin: '4px 0' }}>
                <li>
                  Remove the duplicate id from the dataset and perform data
                  importation again.
                </li>
                <li>
                  Select unique <BoldCodeText>EdgeID</BoldCodeText> field in the
                  dropdown above.
                </li>
              </ol>
            </Block>
          </Block>

          <div
            style={{
              width: '100%',
              padding: '4px 0',
              borderBottom: `1px solid ${theme.colors.contentTertiary}`,
            }}
          />

          <Block marginTop='scale300' color='contentSecondary'>
            Duplicate ID found:{' '}
            <b style={{ marginLeft: '4px' }}>{conflictIdList}</b>
          </Block>
        </Block>
      }
    />
  );
};
