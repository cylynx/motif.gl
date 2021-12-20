import * as GraphSlice from '../slice';
import graphSlice from '../slice';
import {
  sampleNodeColourMap,
  sampleEdgeColourMap,
} from './constants/positive/json';
import { ColorLegend } from '../types';

describe('Style Colour', () => {
  afterEach(() => {
    graphSlice(GraphSlice.initialState, GraphSlice.resetState());
  });

  describe('Style Node with Colour', () => {
    it('should change specific node colour mapping', () => {
      const targetNode = 'node-1';
      const targetColour = '#000000';
      const inputs = [targetNode, targetColour] as [string, string];

      const nodeStyleState = graphSlice(
        GraphSlice.initialState,
        GraphSlice.changeNodeStyle(sampleNodeColourMap),
      );

      const resultState = graphSlice(
        nodeStyleState,
        GraphSlice.changeNodeMappingColor(inputs),
      );

      const edgeStyleColour = resultState.styleOptions.nodeStyle
        .color as ColorLegend;

      const expectedEdgeColor = edgeStyleColour.mapping[targetNode];
      expect(expectedEdgeColor).toBe(targetColour);
    });

    it('should change "Others" node colour mapping', () => {
      const targetNode = 'Others';
      const targetColour = '#000000';
      const inputs = [targetNode, targetColour] as [string, string];

      const nodeStyleState = graphSlice(
        GraphSlice.initialState,
        GraphSlice.changeNodeStyle(sampleNodeColourMap),
      );

      const resultState = graphSlice(
        nodeStyleState,
        GraphSlice.changeNodeMappingColor(inputs),
      );

      const edgeStyleColour = resultState.styleOptions.nodeStyle
        .color as ColorLegend;

      const expectedEdgeColor = edgeStyleColour.mapping['node-9'];
      expect(expectedEdgeColor).toBe(targetColour);
    });
  });

  describe('Style Edge with Colour', () => {
    it('should change specific edge colour mapping', () => {
      const targetEdge = 'node-1';
      const targetColour = '#000000';
      const inputs = [targetEdge, targetColour] as [string, string];

      const edgeStyleState = graphSlice(
        GraphSlice.initialState,
        GraphSlice.changeEdgeStyle(sampleEdgeColourMap),
      );

      const resultState = graphSlice(
        edgeStyleState,
        GraphSlice.changeEdgeMappingColor(inputs),
      );

      const edgeStyleColour = resultState.styleOptions.edgeStyle
        .color as ColorLegend;

      const expectedEdgeColor = edgeStyleColour.mapping[targetEdge];
      expect(expectedEdgeColor).toBe(targetColour);
    });

    it('should change "Others" edge colour mapping', () => {
      const targetEdge = 'Others';
      const targetColour = '#000000';
      const inputs = [targetEdge, targetColour] as [string, string];

      const edgeStyleState = graphSlice(
        GraphSlice.initialState,
        GraphSlice.changeEdgeStyle(sampleEdgeColourMap),
      );

      const resultState = graphSlice(
        edgeStyleState,
        GraphSlice.changeEdgeMappingColor(inputs),
      );

      const edgeStyleColour = resultState.styleOptions.edgeStyle
        .color as ColorLegend;

      const expectedEdgeColor = edgeStyleColour.mapping['node-9'];
      expect(expectedEdgeColor).toBe(targetColour);
    });
  });
});
