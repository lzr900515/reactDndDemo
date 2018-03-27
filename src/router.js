import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import LayoutSet from './routes/LayoutSet';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LayoutSet} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
