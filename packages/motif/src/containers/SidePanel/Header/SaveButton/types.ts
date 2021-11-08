import { Theme } from 'baseui/theme';
import { ExplorerContextProps } from 'src/containers/Graph/context';

export type SaveChoicesMenuProps = { close: any } & SaveButtonProps;
export type SaveButtonProps = {
  onExportExternal?: ExplorerContextProps['onExportExternal'];
};
export type LabelProps = { theme: Theme };
