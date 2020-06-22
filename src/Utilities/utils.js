import { CATEGORIES_COLOR } from './categories';
import cloneDeep from 'lodash/cloneDeep';

const mapEdgeKeys = edge => {
  // Identifies the graph source and target field in edge object
  const edgeKeys = Object.keys(edge);
  if (edgeKeys.includes('source') && edgeKeys.includes('target')) {
    return ['source', 'target'];
  }
  if (edgeKeys.includes('from') && edgeKeys.includes('to')) {
    return ['from', 'to'];
  }
  if (edgeKeys.includes('src') && edgeKeys.includes('dst')) {
    return ['src', 'dst'];
  }
  return false;
};

export const processData = passedData => {
  const data = cloneDeep(passedData);
  for (const node of data.nodes) {
    // Give the display label of the node
    node.label = `${node.data.address.substring(2, 7)}...`;
    // Label nodes which have no defined category as 'Other'
    node.data = {
      category: node.data.category ? node.data.category : 'Other',
      ...node.data,
    };
    // Add style property to node
    node.style = {
      nodeSize: 20,
      primaryColor: CATEGORIES_COLOR[node.data.category],
    };
  }
  // Check keys used to represent graph source and target based on first data edge
  const [sourceField, targetField] = mapEdgeKeys(data.edges[0]);
  for (const edge of data.edges) {
    if (sourceField !== 'source' && targetField !== 'target') {
      // Map edge's source and target over to graphin's format
      delete Object.assign(edge, { source: edge[sourceField] })[sourceField];
      delete Object.assign(edge, { target: edge[targetField] })[targetField];
    }
    edge.label = edge.data.value.toPrecision(3);
    edge.title = `${edge.data.value.toPrecision(3)} ETH`;
    edge.style = {
      endArrow: true,
    };
  }
  return data;
};

export const timeConverter = timestamp => {
  // Unix timestamp in milliseconds
  const a = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = a.getUTCFullYear();
  const month = months[a.getUTCMonth()];
  const date = a.getUTCDate();
  const hour = a.getUTCHours();
  const min =
    a.getUTCMinutes() < 10 ? `0${a.getUTCMinutes()}` : a.getUTCMinutes();
  const sec =
    a.getUTCSeconds() < 10 ? `0${a.getUTCSeconds()}` : a.getUTCSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
};

export const multiplyArr = (arr1, arr2) => {
  // Dot product of two arrays
  let result = 0;
  for (let i = 0; i < arr1.length; i += 1) {
    result += arr1[i] * arr2[i];
  }
  return result;
};

export const roundToTwo = num => num.toFixed(2);

export const processScoreVector = (categories, scoreVector) => {
  // Map score vector to categories
  // For PieChart
  // Output needs to be an array with object {name, value}
  const results = Object.keys(categories)
    .map((key, index) => ({
      name: key,
      value: parseFloat(roundToTwo(scoreVector[index] * 100)),
    }))
    .filter(item => item.value > 0);
  return results;
};

export const json2Blob = json =>
  new Blob([JSON.stringify(json)], {
    type: 'application/json',
  });

export const removeDuplicates = (myArr, prop) => {
  // Remove duplicates from array by checking on prop
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};