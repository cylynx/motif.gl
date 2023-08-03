import { useSelector } from '../../../redux/hooks';
import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { setGraphListPosition } from '../../../utils/export-utils';
import * as GraphT from '../../../redux/graph';
import { GraphSelectors } from '../../../redux/graph';

const useGraphSnapshot = () => {
  const { graphList, styleOptions, graphFlatten, filterOptions } = useSelector(
    GraphSelectors.getGraph,
  );

  const exportJSON = () => {
    const positionGraphList = setGraphListPosition(graphList, graphFlatten);
    const exportData: GraphT.TLoadFormat = {
      data: positionGraphList,
      style: styleOptions,
      filter: filterOptions,
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

  const exportCurrentData = () => {
    const positionGraphList = setGraphListPosition(graphList, graphFlatten);
    const exportData: GraphT.TLoadFormat = {
      data: positionGraphList,
      style: styleOptions,
      filter: filterOptions,
    };

    return exportData;
  };

  const exportPNG = useCallback(() => {
    const graph = document.getElementById('graphin-container');

    html2canvas(graph).then((canvas) => {
      const file = document.createElement('a');
      file.download = 'graph.png';
      file.href = canvas.toDataURL();
      document.body.appendChild(file);
      file.click();
      document.body.removeChild(file);
    });
  }, []);

  return { exportJSON, exportCurrentData, exportPNG };
};

export default useGraphSnapshot;
