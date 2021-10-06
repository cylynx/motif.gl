import React from 'react';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import ErrorMessage from '../../../components/ImportErrorMessage';
import { BoldCodeText } from './JsonErrors';

type EdgeSourceNotExistProps = { edgeId: string };
export const EdgeSourceNotExist = ({ edgeId }: EdgeSourceNotExistProps) => {
  const [, theme] = useStyletron();

  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          edge source not exist.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif unable to parse one of the graph because one of the edge
            source value are pointing to non-existence node id. <br />
            <Block marginTop='scale0'>
              The follow approach may help you to solve this error:
              <ol style={{ margin: '4px 0' }}>
                <li>
                  Refactor and correct the{' '}
                  <BoldCodeText>edge.source</BoldCodeText> value to existing{' '}
                  <BoldCodeText>node.id</BoldCodeText>
                </li>
                <li>
                  Select suitable <BoldCodeText>Source</BoldCodeText> field
                  above.
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
            Related Edge ID: <b style={{ marginLeft: '4px' }}>{edgeId}</b>
          </Block>
        </Block>
      }
    />
  );
};

type EdgeTargetNotExistProps = EdgeSourceNotExistProps;
export const EdgeTargetNotExist = ({ edgeId }: EdgeTargetNotExistProps) => {
  const [, theme] = useStyletron();

  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          edge target not exist.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif unable to parse one of the graph because one of the edge
            target value are pointing to non-existence node id. <br />
            <Block marginTop='scale0'>
              The follow approach may help you to solve this error:
              <ol style={{ margin: '4px 0' }}>
                <li>
                  Refactor and correct the{' '}
                  <BoldCodeText>edge.target</BoldCodeText> value to existing{' '}
                  <BoldCodeText>node.id</BoldCodeText>
                </li>
                <li>
                  Select suitable <BoldCodeText>Target</BoldCodeText> field
                  above.
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
            Related Edge ID: <b style={{ marginLeft: '4px' }}>{edgeId}</b>
          </Block>
        </Block>
      }
    />
  );
};
