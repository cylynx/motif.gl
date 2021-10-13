export const conflictEdgeId = {
  one: 'id,relation,source,target\nthree,three,three,three\nfour,four,four,four',
  two: 'id,relation,source,target\none,one,one,one\ntwo,two,two,two',
};

export const conflictNodeId = {
  one: 'id,value,score\none,20,80\ntwo,40,100',
  two: 'id,value,score\nthree,20,80\nfour,40,100',
};

export const edgeSourceInvalidNode =
  'id,relation,source,target\ntxn1,hello, a,b\ntxn2,works,b,c\ntxn3,abc, c,a\ntxn4,bac,c,a\ntxm5,olleh,d,a';

export const edgeTargetInvalidNode =
  'id,relation,source,target\ntxn1,hello, a,b\ntxn2,works,b,c\ntxn3,abc, c,a\ntxn4,bac,c,a\ntxm5,olleh,a,d';

export const sampleNode = 'id,value,score\n  a,20,80\nb,40,100\nc,60,123';
export const sampleEdge =
  'id,relation,source,target\none-edge,numeric,one,two\ntwo-edge,string,two,three';
