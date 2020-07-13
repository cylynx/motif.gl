import { GetFns } from './Graph';

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
export interface Menu {
  x: number;
  y: number;
  node: object;
}

export interface NodeMenu {
  menu: Menu | null;
}

// Prop Types for Investigate Explorer
export interface InvestigateExplorer {
  name: string;
  currency: string;
  getFns: GetFns;
  overrides: Overrides;
}
