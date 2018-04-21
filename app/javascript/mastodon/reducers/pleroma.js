import { Map as ImmutableMap } from 'immutable';
import { PANEL_FETCH_SUCCESS, PLEROMA_CONFIG_FETCH_SUCCESS } from '../actions/pleroma';

const initialPanel = ImmutableMap({
  enabled: false,
  panel: ''
});

export function custom_panel(state = initialPanel, action) {
  switch (action.type) {
  case PANEL_FETCH_SUCCESS:
    return state.set('panel', action.panel); break;
  case PLEROMA_CONFIG_FETCH_SUCCESS:
    return state.set('enabled', (action.config || {}).showInstanceSpecificPanel || false);
  }

  return state;
};
