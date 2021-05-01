import React, {useEffect} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import 'jquery/src/jquery';
import 'bootstrap/dist/js/bootstrap';
import '@popperjs/core/dist/cjs/popper';

//import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import Spinner from './components/Spinner';

import Signup from './components/Signup';
import Posts from './components/Posts';
import PrivateRoute from './PrivateRoute';
import {getSingleUser, set_isLoggedIn} from './slices/auth';
import {isValidToken} from './utils';
import connect from './socketApi';
import store from './store';
import Navbar from './components/Navbar';
import SinglePost from './components/SinglePost';

connect('http://localhost:3001', store);

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const isValid = isValidToken();
    dispatch(set_isLoggedIn(isValid));
    dispatch(getSingleUser());
  }, [dispatch]);
  const isLoadingSingle = useSelector(state => state.auth.isLoading);
  if (isLoadingSingle) return <Spinner />;
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/sign-up">
          <Signup />
        </Route>
        <PrivateRoute path="/create-post">
          <CreatePost />
        </PrivateRoute>
        <PrivateRoute path="/edit-post/:id">
          <CreatePost />
        </PrivateRoute>
        <PrivateRoute path="/posts">
          <Posts />
        </PrivateRoute>
        <Route path="/post/:id">
          <SinglePost />
        </Route>
      </Switch>
    </>
  );
};

export default withRouter(App);
