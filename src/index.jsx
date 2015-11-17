import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

import App from './app';
import SamplesList from './components/samplesList';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/samples' component={SamplesList} />
    </Route>
  </Router>,
  document.getElementById('root')
);
