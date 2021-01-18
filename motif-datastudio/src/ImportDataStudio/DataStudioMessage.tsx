type DataStudioDimension = {
  id: string;
  name: string;
  type: string;
  concept: string;
};
type DataStudioColor = {
  color: string;
};
type DataStudioThemeColor = DataStudioColor & {
  themeRef: { index: Number };
};
type DataStudioSeriesColor = DataStudioThemeColor & {
  seriesRef: { index: Number };
};
export type DataStudioMessage = {
  tables: {
    DEFAULT: {
      dimensions: string[];
      metric: string[];
    }[];
  };
  fields: {
    dimensions: DataStudioDimension[];
    metric: DataStudioDimension[];
  };
  style: {
    [key: string]: {
      value: Number | { color: string };
      defaultValue: Number | { color: string };
    };
  };
  theme: {
    themeFillColor: DataStudioThemeColor;
    themeFontColor: DataStudioThemeColor;
    themeFontFamily: string;
    themeAccentFillColor: DataStudioThemeColor;
    themeAccentFontColor: DataStudioThemeColor;
    themeAccentFontFamily: string;
    themeSeriesColor: DataStudioSeriesColor[];
    themeIncreaseColor: DataStudioColor;
    themeDecreaseColor: DataStudioColor;
    themeGridColor: DataStudioColor;
  };
  interactions: any;
};
