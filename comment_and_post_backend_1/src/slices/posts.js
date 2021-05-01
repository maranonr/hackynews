import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

import {getHeaders} from '../utils';

export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    isLoading: false,
    data: [],
    singlePost: {},
    isLoadingSubmit: false,
    error: null,
  },

  reducers: {
    posts_attempt: state => {
      state.isLoading = true;
    },
    posts_success: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    posts_fail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    submit_post_attempt: state => {
      state.isLoadingSubmit = true;
    },
    submit_post_success: (state, action) => {
      state.isLoadingSubmit = false;
      state.data = [action.payload].concat(state.data);
    },
    submit_post_fail: (state, action) => {
      state.isLoadingSubmit = false;
      state.error = action.payload;
    },
    update_post_success: (state, action) => {
      state.isLoadingSubmit = false;
      state.data = state.data.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      if(action.payload.id === state.singlePost.id) state.singlePost = action.payload
    },
    delete_post_success: (state, action) => {
      state.isLoadingSubmit = false;
      state.data = state.data.filter(item => item.id !== action.payload.id);
    },
    get_single_post_success: (state, action) => {
      state.singlePost = action.payload;
      state.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  posts_attempt,
  posts_success,
  posts_fail,
  submit_post_attempt,
  submit_post_success,
  submit_post_fail,
  update_post_success,
  delete_post_success,
  get_single_post_success,
} = postsSlice.actions;

export const selectPosts = state => state.posts;

export const fetchPosts = () => async dispatch => {
  const headers = getHeaders();
  try {
    dispatch(posts_attempt());
    const body = await fetch('https://thehackynews.herokuapp.com/posts', {headers});
    const res = await body.json();
    dispatch(posts_success(res));
    return res;
  } catch (err) {
    dispatch(posts_fail(err));
  }
};

export const submitPost = data => async dispatch => {
  const headers = getHeaders();
  try {
    dispatch(submit_post_attempt());
    const body = await fetch('https://thehackynews.herokuapp.com/posts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    const res = await body.json();
    dispatch(submit_post_success(res));
    return res;
  } catch (err) {
    dispatch(submit_post_fail(err));
  }
};

export const updatePost = (id, data) => async dispatch => {
  const headers = getHeaders();

  try {
    const newData = {...data, postId: id};
    dispatch(submit_post_attempt());
    const body = await fetch(`https://thehackynews.herokuapp.com/posts/updatePost`, {
      method: 'POST',
      body: JSON.stringify(newData),
      headers,
    });
    const res = await body.json();
    dispatch(submit_post_success(res));
    return res;
  } catch (err) {
    dispatch(submit_post_fail(err));
  }
};

export const deletePost = id => async dispatch => {
  const headers = getHeaders();
  try {
    dispatch(submit_post_attempt());
    const body = await fetch(`https://thehackynews.herokuapp.com/posts/delete/${id}`, {
      method: 'POST',
      headers,
    });
    const res = await body.json();
    dispatch(delete_post_success({id}));
    return res;
  } catch (err) {
    dispatch(submit_post_fail(err));
  }
};

export const deleteComment = (postId, commentId) => async dispatch => {
  const headers = getHeaders();
  try {
    const body = await fetch(`https://thehackynews.herokuapp.com/posts/comment/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({postId, commentId}),
    });
    const res = await body.json();
    return res;
  } catch (err) {
    dispatch(submit_post_fail(err));
  }
};

export const addComment = (content, id) => async dispatch => {
  const headers = getHeaders();
  try {
    const res = await axios.post(
      'https://thehackynews.herokuapp.com/posts/comment',
      {content, id},
      {headers}
    );
    if (res.data.errors) {
      throw res.data.errors;
    }
    return res.data;
  } catch (err) {
    console.log('errro', err);
    dispatch(submit_post_fail(err));
  }
};

export const getSinglePost = async id => {
  const headers = getHeaders();
  try {
    const res = await axios.get(
      'https://thehackynews.herokuapp.com/posts/singlePost/' + id,
      {headers}
    );
    return res.data;
  } catch (err) {
    return {};
  }
};

export const fetchSinglePost = id => async dispatch => {
  dispatch(posts_attempt());
  const post = await getSinglePost(id);
  dispatch(get_single_post_success(post));
};
export default postsSlice.reducer;
