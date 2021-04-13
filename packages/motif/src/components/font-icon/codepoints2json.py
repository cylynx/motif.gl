# Script to parse codepoints to map between text and unicode
# Material Icon codepoints: https://github.com/google/material-design-icons/blob/master/font/MaterialIconsOutlined-Regular.codepoints
# example line
# 360 e577

import json 

d = {}
with open("material-icons.codepoints", "r") as f:
    lines = f.readlines()
for line in lines:
    text = line.rstrip().split(' ')
    d[text[0]] = text[1] 

with open("icon-map.json", "w") as outfile: 
    json.dump(d, outfile) 