import React from 'react';
import { PLACEMENT, StatefulPopover } from 'baseui/popover';
import { Block } from 'baseui/block';
import { ExplorerContext } from '../../../Graph/context';
import * as Icon from '../../../../components/Icons';
import HeaderButton from '../HeaderButton';
import SaveChoicesMenu from './Menu';
import { SaveButtonProps } from './types';

const SaveButton = ({
  graphList,
  styleOptions,
  graphFlatten,
}: SaveButtonProps) => {
  return (
    <StatefulPopover
      focusLock
      showArrow
      placement={PLACEMENT.bottom}
      content={({ close }) => (
        <ExplorerContext.Consumer>
          {({ onExportExternal }) => (
            <SaveChoicesMenu
              close={close}
              graphList={graphList}
              graphFlatten={graphFlatten}
              styleOptions={styleOptions}
              onExportExternal={onExportExternal}
            />
          )}
        </ExplorerContext.Consumer>
      )}
      accessibilityType='menu'
      autoFocus
      returnFocus
      popperOptions={{
        modifiers: {
          preventOverflow: {
            enabled: true,
          },
          hide: {
            enabled: false,
          },
        },
      }}
    >
      <Block as='span'>
        <HeaderButton
          key={2}
          name='Save'
          icon={<Icon.Save />}
          isDisabled={false}
        />
      </Block>
    </StatefulPopover>
  );
};

export default SaveButton;
