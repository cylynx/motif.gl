import { clientState } from '../investigate/selectors';

const getUI = (state: any) => clientState(state).ui;

export { getUI };
