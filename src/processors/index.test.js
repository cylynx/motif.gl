import addData from './index';

const testJSONData = [
  {
    edges: [
      {
        id: '1',
        source: '1',
        target: '2',
      },
    ],
    nodes: [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ],
  },
];

test('addData can render in browser properly', () => {
  console.log(addData(testJSONData));
});
