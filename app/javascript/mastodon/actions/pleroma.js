import api from '../api';

export const TOS_FETCH_REQUEST = 'TOS_FETCH_REQUEST';
export const TOS_FETCH_SUCCESS = 'TOS_FETCH_SUCCESS';
export const TOS_FETCH_FAIL = 'TOS_FETCH_FAIL';
export const PANEL_FETCH_REQUEST = 'PANEL_FETCH_REQUEST';
export const PANEL_FETCH_SUCCESS = 'PANEL_FETCH_SUCCESS';
export const PANEL_FETCH_FAIL = 'PANEL_FETCH_FAIL';
export const PLEROMA_CONFIG_FETCH_REQUEST = 'PLEROMA_CONFIG_FETCH_REQUEST';
export const PLEROMA_CONFIG_FETCH_SUCCESS = 'PLEROMA_CONFIG_FETCH_SUCCESS';
export const PLEROMA_CONFIG_FETCH_FAIL = 'PLEROMA_CONFIG_FETCH_FAIL';

export function fetchTOS() {
  return (dispatch, getState) => {
    dispatch(fetchTOSRequest());

    api(getState).get('/static/terms-of-service.html').then(response => {
      dispatch(fetchTOSSuccess(response.data));
    }).catch(error => {
      dispatch(fetchTOSFail(error));
    });
  };
};

export function fetchPanel() {
  return (dispatch, getState) => {
    dispatch(fetchPanelRequest());

    api(getState).get('/instance/panel.html').then(response => {
      dispatch(fetchPanelSuccess(response.data));
    }).catch(error => {
      dispatch(fetchPanelFail(error));
    });
  };
};

export function fetchPleromaConfig() {
  return (dispatch, getState) => {
    dispatch(fetchPleromaConfigRequest());

    api(getState).get('/api/statusnet/config.json').then(response => {
      dispatch(fetchPleromaConfigSuccess(response.data));
    }).catch(error => {
      dispatch(fetchPleromaConfigFail(error));
    });
  };
};

export function fetchTOSRequest() {
  return {
    type: TOS_FETCH_REQUEST,
  };
};

export function fetchTOSSuccess(tos) {
  return {
    type: TOS_FETCH_SUCCESS,
    tos,
  };
};

export function fetchTOSFail(error) {
  return {
    type: TOS_FETCH_FAIL,
    error,
  };
};

export function fetchPanelRequest() {
  return {
    type: PANEL_FETCH_REQUEST,
  };
};

export function fetchPanelSuccess(panel) {
  return {
    type: PANEL_FETCH_SUCCESS,
    panel,
  };
};

export function fetchPanelFail(error) {
  return {
    type: PANEL_FETCH_FAIL,
    error,
  };
};

export function fetchPleromaConfigRequest() {
  return {
    type: PLEROMA_CONFIG_FETCH_REQUEST,
  };
};

export function fetchPleromaConfigSuccess(config) {
  return {
    type: PLEROMA_CONFIG_FETCH_SUCCESS,
    config,
  };
};

export function fetchPleromaConfigFail(error) {
  return {
    type: PLEROMA_CONFIG_FETCH_FAIL,
    error,
  };
};
