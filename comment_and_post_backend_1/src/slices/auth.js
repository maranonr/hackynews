import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import * as _ from 'lodash';
import {getHeaders, isValidToken} from '../utils';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: {},
    isLoggedIn: isValidToken() || false,
    isLoadingSubmit: false,
    isLoading: false,
    error: null,
  },

  reducers: {
    login_attempt: state => {
      state.isLoadingSubmit = true;
    },
    login_success: (state, action) => {
      state.isLoadingSubmit = false;
      state.data = action.payload;
      state.error = null;
      state.isLoggedIn = true;
    },
    set_isLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    login_fail: (state, action) => {
      state.isLoadingSubmit = false;
      state.error = _.get(
        action.payload,
        'response.data.message',
        'Input Error! Try again!'
      );
    },
    signup_attempt: state => {
      state.isLoadingSubmit = true;
    },
    signup_success: state => {
      state.isLoadingSubmit = false;
      state.error = null;
    },
    signup_fail: (state, action) => {
      state.isLoadingSubmit = false;
      state.error = _.get(
        action.payload,
        'response.data.message',
        'Input Error! Try again!'
      );
    },
    single_user_attempt: state => {
      state.isLoading = true;
    },
    single_user_success: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    single_user_fail: (state, action) => {
      state.isLoading = false;
      //  state.error = _.get(
      //    action.payload,
      //    'response.data.message',
      //    'Invalid Attempt'
      //  );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login_attempt,
  login_success,
  login_fail,
  signup_attempt,
  signup_success,
  signup_fail,
  single_user_attempt,
  single_user_success,
  single_user_fail,
  set_isLoggedIn,
} = authSlice.actions;

export const selectUser = state => state?.auth?.data || {};
export const selectIsLoadingSubmit = state =>
  state?.auth?.isLoadingSubmit || false;
export const selectIsLoggedIn = state => state?.auth?.isLoggedIn || false;

export const selectAuthError = state => state?.auth?.error;

export const handleLogin = data => async dispatch => {
  try {
    dispatch(login_attempt());
    const body = await axios({
      url: 'https://thehackynews.herokuapp.com/auth/login',
      method: 'POST',
      data,
      headers: getHeaders(),
    });
    if (body.data.errors) {
      dispatch(login_fail(body.data.errors));
      throw body.data.errors;
    }
    const res = body.data;
    dispatch(login_success({...res, id: res.id || res._id}));
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res);
    return res;
  } catch (err) {
    dispatch(login_fail(err));
    throw err;
  }
};

export const handleGoogleLogin = data => async dispatch => {
  try {
    dispatch(login_attempt());
    const body = await axios({
      url: 'https://thehackynews.herokuapp.com/auth/googlelogin',
      method: 'POST',
      data,
      headers: getHeaders(),
    });
    if (body.data.errors) {
      dispatch(login_fail(body.data.errors));
      throw body.data.errors;
    }
    const res = body.data;
    dispatch(login_success({ ...res, id: res.id || res._id }));
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res);
    return res;
  } catch (err) {
    dispatch(login_fail(err));
    throw err;
  }
}

export const handleSignup = data => async dispatch => {
  try {
    dispatch(signup_attempt());
    const body = await axios.post('https://thehackynews.herokuapp.com/auth/signup', data, {
      headers: getHeaders(),
    });
    const res = body.data;
    if (body.data.errors) {
      dispatch(signup_fail(body.data.errors));
      throw body.data.errors;
    }
    dispatch(signup_success(res));
    return res;
  } catch (err) {
    dispatch(signup_fail(err));
    throw err;
  }
};

export const getSingleUser = () => async dispatch => {
  try {
    dispatch(single_user_attempt());
    const body = await axios.get('https://thehackynews.herokuapp.com/auth/single', {
      headers: getHeaders(),
    });
    if (body.status === 401) {
      return dispatch(set_isLoggedIn(false));
    }
    const res = body.data;
    dispatch(single_user_success(res));
    return res;
  } catch (err) {
    dispatch(single_user_fail(err));
  }
};

export default authSlice.reducer;
