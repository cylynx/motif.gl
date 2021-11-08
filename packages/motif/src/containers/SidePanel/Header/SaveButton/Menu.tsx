import { useStyletron } from 'baseui';
import { StatefulMenu } from 'baseui/menu';
import React, { FC, useMemo } from 'react';
import { colors } from 'baseui/tokens';
import * as Label from './Labels';
import * as GraphT from '../../../../redux/graph';
import { SaveChoicesMenuProps } from './types';
import useGraphSnapshot from '../useGraphSnapshot';

const SaveChoicesMenu: FC<SaveChoicesMenuProps> = ({
  close,
  onExportExternal,
}) => {
  const [, theme] = useStyletron();
  const { exportJSON, exportCurrentData } = useGraphSnapshot();

  const saveToCloud = () => {
    const exportData: GraphT.TLoadFormat = exportCurrentData();
    onExportExternal(exportData);
  };

  const items = useMemo(() => {
    const items = [
      {
        label: <Label.JsonAttachment theme={theme} />,
        onClick: () => exportJSON(),
      },
    ];

    if (onExportExternal) {
      items.push({
        label: <Label.CloudUpload theme={theme} />,
        onClick: () => saveToCloud(),
      });
    }

    return items;
  }, [exportJSON, theme]);

  return (
    <StatefulMenu
      items={items}
      onItemSelect={(e) => {
        e.item.onClick();
        close();
      }}
      overrides={{
        List: {
          style: {
            height: '100%',
            width: '200ox',
            backgroundColor: colors.gray700,
          },
        },
      }}
    />
  );
};

export default SaveChoicesMenu;
