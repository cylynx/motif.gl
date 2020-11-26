import { schemeTableau10, schemeSet2 } from 'd3-scale-chromatic';

// See the colors: https://observablehq.com/@d3/color-schemes?collection=@d3/d3-scale-chromatic
// For reference
// schemeSet2 = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
// schemeTableau10  = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

// Use "#66c2a5" as primary color and tableau10 less grey for labels
// medium grey is used only for not applicable data
// light grey is used for nodes that are not highlighted

export const GREY = '#cccccc';
export const DARK_GREY = '#A9A9A9';

export const PRIMARY_COLOR = schemeSet2[0];

export const CATEGORICAL_COLOR = schemeTableau10.slice(0, 9);
