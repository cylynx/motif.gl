import { OutputSelector } from '@reduxjs/toolkit';
import { Option } from 'baseui/select';
import * as GraphT from './types';

export interface IGraphSelector {
  getPaginateItems: OutputSelector<
    [
      (state: any) => GraphT.ItemProperties,
      (state: any) => GraphT.SearchOptPagination,
    ],
    GraphT.ItemProperties,
    (
      selectedItems: GraphT.ItemProperties,
      pagination: GraphT.SearchOptPagination,
    ) => GraphT.ItemProperties
  >;

  getGraphFiltered: OutputSelector<
    [(state: any) => GraphT.GraphData, (state: any) => GraphT.FilterOptions],
    GraphT.GraphData,
    (
      graphFlatten: GraphT.GraphData,
      filerOptions: GraphT.FilterOptions,
    ) => GraphT.GraphData
  >;

  getGraphVisible: OutputSelector<
    [(state: any) => GraphT.GraphData, (state: any) => GraphT.StyleOptions],
    GraphT.GraphData,
    (
      graphFiltered: GraphT.GraphData,
      styleOptions: GraphT.StyleOptions,
    ) => GraphT.GraphData,
    never
  >;

  getGraphVisibleNodeOptions: OutputSelector<
    [(state: any) => GraphT.GraphData],
    Option[],
    (graphVisible: GraphT.GraphData) => Option[],
    never
  >;

  getGraphFieldsOptions: OutputSelector<
    [(state: any) => GraphT.GraphData],
    any,
    (graphFlatten: GraphT.GraphData) => any
  >;

  getUngroupedGraphFlatten: OutputSelector<
    [(state: any) => GraphT.GraphList],
    GraphT.GraphData,
    (graphList: GraphT.GraphList) => GraphT.GraphData
  >;
}
