export const sampleNodeEdgeData = {
  edgeCsv: [
    {
      fileName: 'test-1.csv',
      content:
        'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'test-2.csv',
      content: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
    },
  ],
};

export const whitespaceNodeEdge = {
  edgeCsv: [
    {
      fileName: 'test-1.csv',
      content:
        'id,relation,source,target\ntxn1,hello,   a,b   \ntxn2,works,b  ,c \ntxn3,abc,c  ,  a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'test-2.csv',
      content: 'id,value,score\n   a,20,80\nb   ,40,100\n   c,60,123',
    },
  ],
};

export const numericAccessorsNodeEdge = {
  edgeCsv: [
    {
      fileName: 'numeric-accessors-1.csv',
      content:
        'id,relation,numeric_source,numeric_target\ntxn1,hello,1,2\ntxn2,works,2,3\ntxn3,abc,3,1\n',
    },
  ],
  nodeCsv: [
    {
      fileName: 'numeric-accessors-2.csv',
      content: 'custom_id,value,score\n1,20,80\n2,40,100\n3,60,123',
    },
  ],
};
