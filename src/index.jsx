import 'semantic.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import App from './app';
import Clone from './containers/clone';
import AllClones from './containers/allClones';
import SampleAnalysis from './components/sampleAnalysis';
import AllSamples from './containers/allSamples';
import AllSequences from './containers/allSequences';
import Sequence from './components/sequence';
import SubjectList from './components/subjectList';
import Subject from './containers/subject';

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='/clones' component={AllClones} />
      <Route path='/clone/:id' component={Clone} />
      <Route path='/samples' component={AllSamples} />
      <Route path='/sample-analysis/:sampleEncoding' component={SampleAnalysis} />
      <Route path='/sequences' component={AllSequences} />
      <Route path='/sequence/:sampleId/:seqId' component={Sequence} />
      <Route path='/subjects' component={SubjectList} />
      <Route path='/subject/:id' component={Subject} />
    </Route>
  </Router>,
  document.getElementById('root')
);
