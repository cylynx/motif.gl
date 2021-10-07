import React from 'react';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import { StyledLink } from 'baseui/link';
import ErrorMessage from '../../../components/ImportErrorMessage';
import { BoldCodeText } from './JsonErrors';

type EdgeSourceNotExistProps = { edgeSource: string };
export const EdgeSourceNotExist = ({ edgeSource }: EdgeSourceNotExistProps) => {
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
            Related Edge Source:{' '}
            <b style={{ marginLeft: '4px' }}>{edgeSource}</b>
          </Block>
        </Block>
      }
    />
  );
};

type EdgeTargetNotExistProps = { edgeTarget: string };
export const EdgeTargetNotExist = ({ edgeTarget }: EdgeTargetNotExistProps) => {
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
            Related Edge Target:{' '}
            <b style={{ marginLeft: '4px' }}>{edgeTarget}</b>
          </Block>
        </Block>
      }
    />
  );
};

export const RestrictedNodeDataType = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The uploaded datasets contain type column in node properties
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <BoldCodeText>type</BoldCodeText> is a reserve words used as
          identifiers to perform styling.
          <br />
          You can rename <BoldCodeText>type</BoldCodeText> column to{' '}
          <BoldCodeText>node_type</BoldCodeText> or{' '}
          <BoldCodeText>types</BoldCodeText> to import data successfully.
        </Block>
      }
    />
  );
};

export const RestrictedEdgeDataType = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The uploaded datasets contain type column in edge properties
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <BoldCodeText>type</BoldCodeText> is a reserve words used as
          identifiers to perform styling.
          <br />
          You can rename <BoldCodeText>type</BoldCodeText> column to{' '}
          <BoldCodeText>edge_type</BoldCodeText> or{' '}
          <BoldCodeText>types</BoldCodeText> to import data successfully.
        </Block>
      }
    />
  );
};

export const UnknownErrorOccurs = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          An unexpected error occurs.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Please try again by reload the application.
          <br />
          If this problem persists, please{' '}
          <StyledLink href='mailto:motif@cylynx.io'>Contact Us</StyledLink> to
          report the error with your provided dataset. We will fix the problem
          as soon as possible.
        </Block>
      }
    />
  );
};
