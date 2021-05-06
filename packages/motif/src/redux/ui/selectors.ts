import { UIState } from './types';

const getUI = (state: any): UIState => state.investigate.ui;

export { getUI };
