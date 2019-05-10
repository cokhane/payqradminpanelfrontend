import React from 'react';
import Loadable from 'react-loadable'
import DefaultLayout from '../container/defaultlayout/defaultlayout.js';

function Loading(){
  return <div> </div>
}


const OrderManagement = Loadable({
  loader: () => import('../views/order/order.js'),
  loading: Loading,
});

const DepositFlow = Loadable({
  loader: () => import('../views/deposit/deposit.js'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('../views/user/userparent.js'),
  loading: Loading,
});

const UserProfile = Loadable({
  loader: () => import('../views/userprofile/userprofile.js'),
  loading: Loading,
});

const BalanceRequest = Loadable({
  loader: () => import('../views/balancerequest/balancerequest.js'),
  loading: Loading,
});

const Setting = Loadable({
  loader: () => import('../views/setting/setting.js'),
  loading: Loading,
});



const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/order', exact: true, name: 'Order Management', component: OrderManagement },
  { path: '/deposit', name: 'Deposit Flow Management', component: DepositFlow },
  { path: '/user', name: 'User Management', component: User },
  { path: '/setting', name: 'Setting Management', component: Setting },
  { path: '/userprofile', name: 'User Profile', component: UserProfile },
  { path: '/balancerequest', name: 'User Profile', component: BalanceRequest },
];

export default routes;
