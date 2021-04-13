import { Theme } from 'baseui/theme';
import { HistogramBin } from '../../utils/data-utils/data-utils';

export type TPlotDiv = { $theme?: Theme; $expanded: boolean };
export type THistogramProp = Partial<{
  domain: [number, number];
  step: number;
  histogram: HistogramBin[];
  format: string;
  analyzerType: string;
}>;
