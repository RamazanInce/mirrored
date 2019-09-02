import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  ACCOUNT_VERIFIED,
  ACCOUNT_NOT_VERIFIED,
  RESEND_CONFIRMATION,
  RESEND_CONFIRMATION_FAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Register with social network
export const registerWithSocialMedia = ({ name, email, avatar }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, avatar });
  try {
    const res = await axios.post(`/api/auth/registerWithSocialMedia`, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // expect a user token from database
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Verifying user account
export const verifyAccount = verifyToken => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ verifyToken });

  try {
    const res = await axios.post(`/api/users/verify/${verifyToken}`, body, config);

    dispatch({
      type: ACCOUNT_VERIFIED,
      payload: res.data.msg,
    });
  } catch (err) {
    // const errors = err.response.data.errors
    console.error(err);
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    // }

    dispatch({
      type: ACCOUNT_NOT_VERIFIED,
      payload: err.response.data.msg,
    });
  }
};

//Resend email confirmation
export const resendEmail = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email });

  try {
    const res = await axios.put(`/api/users/verify/resend`, body, config);

    dispatch({
      type: RESEND_CONFIRMATION,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: RESEND_CONFIRMATION_FAIL,
    });
  }
};
