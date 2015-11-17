import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

import App from './app';
import SampleList from './components/sampleList';
import SequenceList from './components/sequenceList';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/samples' component={SampleList} />
      <Route path='/sequences' component={SequenceList} />
    </Route>
  </Router>,
  document.getElementById('root')
);
