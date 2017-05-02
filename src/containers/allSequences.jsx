import React from 'react';

import SequenceList from '../components/sequenceList';

export default class AllSequences extends React.Component {
  render() {
    return (
      <div>
        <h1>Sequences</h1>
        <SequenceList />
      </div>
    );
  }
}
