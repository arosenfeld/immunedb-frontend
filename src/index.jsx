import '../semantic/dist/semantic.js';
import '../semantic/dist/semantic.css';

import React from 'react';
import { render } from 'react-dom';

import { Route, Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import App from './app';

import AllSamples from './containers/allSamples';
import AllSequences from './containers/allSequences';
import AllClones from './containers/allClones';
import Clone from './containers/clone';
import SampleAnalysis from './components/sampleAnalysis';
import Sequence from './components/sequence';
import SubjectList from './components/subjectList';
import Subject from './containers/subject';
import Download from './containers/download';
import Export from './containers/export';


let history = useRouterHistory(createHistory)({
  basename: '/BASENAME'
});

render(
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='clones' component={AllClones} />
      <Route path='clone/:id' component={Clone} />
      <Route path='samples' component={AllSamples} />
      <Route path='sample-analysis/:sampleEncoding' component={SampleAnalysis} />
      <Route path='sequences' component={AllSequences} />
      <Route path='sequence/:sampleId/:seqId' component={Sequence} />
      <Route path='subjects' component={SubjectList} />
      <Route path='download' component={Download} />
      <Route path='subject/:id' component={Subject} />
      <Route path='export/:sampleEncoding' component={Export} />
    </Route>
  </Router>,
  document.getElementById('root')
);
