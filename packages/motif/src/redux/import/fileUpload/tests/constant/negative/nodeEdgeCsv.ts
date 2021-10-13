export const emptyEdgeRow = 'id,relation,source,target';
export const emptyNodeRow = 'id,value,score';
export const invalidNode = '';
export const invalidEdge = '';
export const edgeRestricted =
  'id,relation,source,target,type\ntxn1,hello, a,b,12\ntxn2,works,b,c\ntxn3,abc, c,a\ntxn4,bac,c,a\ntxm5,olleh,a,b';
export const nodeRestricted =
  'id,value,score,type\na,20,80,hello\nb,40,100\nc,60,123';
export const sampleNode = 'id,value,score\n  a,20,80\nb,40,100\nc,60,123';
export const sampleEdge =
  'id,relation,source,target\ntxn1,hello, a,b\ntxn2,works,b,c\ntxn3,abc, c,a\ntxn4,bac,c,a\ntxm5,olleh,a,b';
