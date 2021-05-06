import { Edge } from '../../redux/graph/types';
import { getEdgeProperties } from './utils';

describe('Graph Utilities', () => {
  describe('getEdgeProperties', () => {
    const sampleEdge: Edge = {
      id: 'cat-dog',
      source: 'cat',
      target: 'dog',
      true: true,
      false: false,
      number: 0,
      object: {
        string: '123123123',
        object2: {
          value: 1,
        },
      },
    };

    const kind = 'all';
    let edgeProperties: Partial<Edge> = {};
    beforeAll(() => {
      edgeProperties = getEdgeProperties(sampleEdge, kind, []);
    });

    afterAll(() => {
      edgeProperties = {};
    });

    it('should possess id, source and target', () => {
      const { id, source, target } = edgeProperties as Edge;
      expect(id).toEqual(sampleEdge.id);
      expect(source).toEqual(sampleEdge.source);
      expect(target).toEqual(sampleEdge.target);
    });

    it('should possess boolean properties without ignore false', () => {
      expect(edgeProperties.true).toEqual(sampleEdge.true);
      expect(edgeProperties.false).toEqual(sampleEdge.false);
    });

    it('should possess number value without ignore zero', () => {
      const { number } = edgeProperties;
      expect(number).toEqual(sampleEdge.number);
    });

    it('should remains nested object value', () => {
      expect(edgeProperties['object.string']).toEqual(sampleEdge.object.string);
      expect(edgeProperties['object.object2.value']).toEqual(
        sampleEdge.object.object2.value,
      );
    });
  });
});
