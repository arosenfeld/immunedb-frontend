import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

import App from './app';
import Studies from './containers/studies';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/studies' component={Studies} />
    </Route>
  </Router>,
  document.getElementById('root')
);
