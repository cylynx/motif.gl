import { OutputSelector } from '@reduxjs/toolkit';
import * as GraphT from './types';

export interface IGraphSelector {
  getPaginateItems: OutputSelector<
    any,
    GraphT.ItemProperties,
    (
      selectedItems: GraphT.ItemProperties,
      pagination: GraphT.SearchOptPagination,
    ) => GraphT.ItemProperties
  >;
}
