import { clientState } from '../investigate/selectors';

const getWidget = (state: any) => clientState(state).widget;

export { getWidget };
