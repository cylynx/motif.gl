// Prop Types for Investigate Component
export interface Overrides {
  Tabs: React.FC[];
  NodeMenu: React.FC;
  score: number[];
}

// Prop Types for ImportWizard
export interface ImportWizard {
  tabs: React.FC[];
}

// Prop Types for NodeMenu
interface Menu {
  x: number;
  y: number;
  node: object;
}

export interface NodeMenu {
  menu: Menu | null;
}
