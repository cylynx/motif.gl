import { useStyletron } from 'baseui';
import { StatefulMenu } from 'baseui/menu';
import React, { FC, useMemo } from 'react';
import { colors } from 'baseui/tokens';
import * as Label from './Labels';
import { setGraphListPosition } from '../../../../utils/export-utils';
import * as GraphT from '../../../../redux/graph';
import { SaveChoicesMenuProps } from './types';

const SaveChoicesMenu: FC<SaveChoicesMenuProps> = ({
  close,
  graphList,
  styleOptions,
  graphFlatten,
  onExportExternal,
}) => {
  const [, theme] = useStyletron();

  const exportJSON = (
    graphList: GraphT.GraphList,
    styleOptions: GraphT.StyleOptions,
  ) => {
    const positionGraphList = setGraphListPosition(graphList, graphFlatten);
    const exportData: GraphT.TLoadFormat = {
      data: positionGraphList,
      style: styleOptions,
    };

    const contentType = 'application/json;charset=utf-8;';
    const jsonInfo: string = JSON.stringify(exportData);
    const file: HTMLAnchorElement = document.createElement('a');
    file.download = 'graph.json';
    file.href = `data:${contentType},${encodeURIComponent(jsonInfo)}`;
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  };

  const saveToCloud = (graphList, styleOptions) => {
    const positionGraphList = setGraphListPosition(graphList, graphFlatten);
    const exportData: GraphT.TLoadFormat = {
      data: positionGraphList,
      style: styleOptions,
    };

    onExportExternal(exportData);
  };

  const items = useMemo(() => {
    const items = [
      {
        label: <Label.JsonAttachment theme={theme} />,
        onClick: () => exportJSON(graphList, styleOptions),
      },
    ];

    if (onExportExternal) {
      items.push({
        label: <Label.CloudUpload theme={theme} />,
        onClick: () => saveToCloud(graphList, styleOptions),
      });
    }

    return items;
  }, [graphList, styleOptions, exportJSON, theme, graphFlatten]);

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
