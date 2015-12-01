import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import App from './app';
import Clone from './components/clone';
import CloneList from './components/cloneList';
import SampleAnalysis from './components/sampleAnalysis';
import SampleList from './components/sampleList';
import SequenceList from './components/sequenceList';
import Sequence from './components/sequence';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/clones' component={CloneList} />
      <Route path='/clone/:id' component={Clone} />
      <Route path='/samples' component={SampleList} />
      <Route path='/sample-analysis/:sampleEncoding' component={SampleAnalysis} />
      <Route path='/sequences' component={SequenceList} />
      <Route path='/sequence/:sampleId/:seqId' component={Sequence} />
    </Route>
  </Router>,
  document.getElementById('root')
);
