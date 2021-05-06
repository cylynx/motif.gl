import { Value } from 'baseui/select';

export const SIDE_NAVBAR_WIDTH = '50px';

// width (310) + padding (14 * 2)
export const LEFT_LAYER_WIDTH = '338px';

export const ITEM_PER_PAGE = 5;

export const NUMERIC_AGGREGATIONS: Value = [
  {
    id: 'min',
    label: 'Min',
  },
  {
    id: 'max',
    label: 'Max',
  },
  {
    id: 'average',
    label: 'Average',
  },
  {
    id: 'count',
    label: 'Count',
  },
  {
    id: 'sum',
    label: 'Sum',
  },
];

export const STRING_AGGREGATIONS: Value = [
  {
    id: 'first',
    label: 'First',
  },
  {
    id: 'last',
    label: 'Last',
  },
  {
    id: 'most_frequent',
    label: 'Most Frequent',
  },
];
