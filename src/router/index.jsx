import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import App from '../App';
import LoginPage from '../feature/Auth/components/Login/LoginPage';
import BaseLayout from '../layouts/BaseLayout';
import Users from '../feature/Users/page';
import PrivateRoute from '../layouts/PrivateRoute';
import ViewUserData from '../feature/Users/components/ViewUserData';
import KycRequestTable from '../feature/KYC/page';
import BattleIndex from '../feature/Battles/pages';
import AddUTRTable from '../feature/AddUTR/page';
import Withdrawal from '../feature/withdrawl/pages';
import SettingPage from '../feature/Settings/pages';
import HomePage from '../feature/Home/pages';
import AddMoneyPage from '../feature/Add-Money/pages';
import ManageGame from '../feature/Manage-Game/page';
import CreateGame from '../feature/Manage-Game/components/CreateGame';
import ViewGame from '../feature/Manage-Game/components/ViewGame';
import EndBattlePage from '../feature/Battles/pages/EndBattlePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={'/home'} />,
      },
      {
        path: '/auth',
        element: <LoginPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <BaseLayout />,
            children: [
              {
                path: '/users',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <Users />,
                  },
                  {
                    path: ':id',
                    element: <ViewUserData />,
                  },
                ],
              },
              {
                path: '/kyc-request',
                element: <KycRequestTable />,
              },
              {
                path: '/home',
                element: <HomePage />,
              },
              {
                path: '/add-utr',
                element: <AddUTRTable />,
              },
              {
                path: '/battles',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <BattleIndex />,
                  },
                  {
                    path: ':battleType/:id',
                    element: <EndBattlePage />,
                  },
                ],
              },
              {
                path: '/manage-game',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <ManageGame />,
                  },
                  {
                    path: 'create',
                    element: <CreateGame />,
                  },
                  {
                    path: ':id',
                    element: <ViewGame />,
                  },
                ],
              },
              {
                path: '/withdrawal',
                element: <Withdrawal />,
              },
              {
                path: '/add-money',
                element: <AddMoneyPage />,
              },
              {
                path: '/settings',
                element: <SettingPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
