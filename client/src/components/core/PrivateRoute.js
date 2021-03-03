import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isLogin = () => {
  return sessionStorage.getItem('isLoggedIn') === 'true' ? true : false;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLogin() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default PrivateRoute;
