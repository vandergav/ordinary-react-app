import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './core/PrivateRoute';
import Login from './Login';
import AccountDetails from './AccountDetails';
import TransactionHistory from './TransactionHistory';
import AddTransaction from './AddTransaction';

const App = () => {
  const routes = (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <PrivateRoute exact path="/home/:id" component={AccountDetails} />
      <PrivateRoute
        exact
        path="/transactionhistory"
        component={TransactionHistory}
      />
      <PrivateRoute exact path="/addtransaction" component={AddTransaction} />
    </Switch>
  );
  return <BrowserRouter>{routes}</BrowserRouter>;
};

export default App;
