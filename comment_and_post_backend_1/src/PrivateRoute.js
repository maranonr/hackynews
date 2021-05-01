import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {selectIsLoggedIn} from './slices/auth';

function PrivateRoute({children, ...rest}) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Route
      {...rest}
      render={() => {
        return isLoggedIn === true ? children : <Redirect to="/login" />;
      }}
    />
  );
}

export default PrivateRoute;
