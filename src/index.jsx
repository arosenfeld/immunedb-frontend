import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import App from './app';
import CloneList from './components/cloneList';
import SampleList from './components/sampleList';
import SequenceList from './components/sequenceList';
import Sequence from './components/sequence';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/clones' component={CloneList} />
      <Route path='/samples' component={SampleList} />
      <Route path='/sequences' component={SequenceList} />
      <Route path='/sequence/:sampleId/:seqId' component={Sequence} />
    </Route>
  </Router>,
  document.getElementById('root')
);
