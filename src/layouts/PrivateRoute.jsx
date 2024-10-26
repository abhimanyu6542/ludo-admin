// This component will check whether the user is authenticated.
// If not it will not allow the user to access the route

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const authState = (state) => state.auth;

function PrivateRoute() {
  const navigate = useNavigate();
  const { user } = useSelector(authState);


  useEffect(() => {
    if (!user) {
      return navigate('/auth');
    }
  }, [user]);

  return  <Outlet />;
}

export default PrivateRoute;
