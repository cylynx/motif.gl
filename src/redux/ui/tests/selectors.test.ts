// @ts-nocheck
import { combineReducers } from '@reduxjs/toolkit';
import investigateReducer from '../../investigate/reducer';
import { initialStateUi } from '../reducer';
import { getUI } from '../selectors';

const clientReducer = combineReducers({
  investigate: investigateReducer,
});

describe('selectors', () => {
  it('initial selectors should be valid', async () => {
    const results = clientReducer({}, {});
    expect(getUI(results)).toEqual(initialStateUi);
  });
});
