/* https://github.com/uber/baseweb/blob/master/src/themes/shared/borders.js  */
import { Borders } from 'baseui/theme';

const borderColor = 'rgba(140, 140, 151, 0.16)';

const borders: Partial<Borders> = {
  border100: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  border200: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  border300: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  border400: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  border500: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  border600: {
    borderColor,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  radius100: '4px',
  radius200: '6px',
  radius300: '8px',
  radius400: '12px',
  /** Button, ButtonGroup */
  buttonBorderRadius: '6px',
  /** Input, Select, Textarea, Checkbox */
  inputBorderRadius: '6px',
  /** Popover, Menu, Tooltip */
  popoverBorderRadius: '6px',
  /** Card, Datepicker, Modal, Toast, Notification */
  surfaceBorderRadius: '6px',
  tagBorderRadius: '6px',
};

export default borders;
